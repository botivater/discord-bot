import Config from "@/common/config";
import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import logger from "@/logger";
import { bold, italic, userMention } from "@discordjs/builders";
import discord from "..";
import activityHelper from "../helpers/activityHelper";

// Timeout in seconds.
// 60 => 60 seconds
// 60 * 60 => 60 minutes
// 60 * 60 * 24 => 24 hours
// 60 * 60 * 24 * 7 => 7 days
// 60 * 60 * 24 * 182 => 182 days (aprox. 6 months)
const timeoutSeconds = 60 * 60 * 24 * 90;

export default {
    handle: async () => {
        const now = new Date().getTime();
        const comparisonDate = new Date(now - timeoutSeconds * 1000);

        const em = database.getORM().em.fork();

        const dbGuildMembers = await em.find(
            GuildMemberEntity,
            {
                lastInteraction: {
                    $lte: comparisonDate,
                },
            },
            { populate: ["guild"] }
        );

        if (dbGuildMembers.length === 0) return;

        const discordClient = discord.getClient();

        const guild = discordClient.guilds.cache.get("803327192662671463");

        if (!guild) {
            logger.verbose("Guild not found in inactive users cron job");
            return;
        }

        await guild.channels.fetch()
        let guildChannel = guild.channels.cache.find(channel => channel.name == "systeem");
        if (!guildChannel) {
            guildChannel = await guild.channels.create("systeem", {
                type: "GUILD_TEXT"
            });
        }

        if (!guildChannel) {
            logger.verbose(
                "Guild channel not found in inactive users cron job"
            );
            return;
        }

        if (!guildChannel.isText()) {
            logger.verbose(
                "Guild channel not a text channel in inactive users cron job"
            );
            return;
        }

        for (const dbGuildMember of dbGuildMembers) {
            if (dbGuildMember.lastInteraction === undefined) continue;
            if (dbGuildMember.active === false) continue;

            logger.verbose(
                `Setting user '${dbGuildMember.name}' with uid '${dbGuildMember.snowflake}' to inactive.`
            );

            let message = `${bold("Ik heb iemand op non-actief gezet.")}\r\n`;
            message += `Gebruiker: ${userMention(dbGuildMember.snowflake)} (${dbGuildMember.identifier})\r\n`;
            message += `Laatste interactie: ${dbGuildMember.lastInteraction.toLocaleDateString(
                "nl-NL",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            )}\r\n`;
            message += `Ik heb deze persoon de rol 'Non-Actief' toegewezen. *LET OP! Gelieve zelf te checken of deze persoon de privérollen nog heeft, indien ja, verwijder deze. In de toekomst zal Mira dit zelf kunnen.*`;

            guildChannel.send({
                content: message,
                allowedMentions: {
                    parse: [],
                },
            });

            dbGuildMember.active = false;
            em.persist(dbGuildMember);

            await activityHelper.addInactiveRole({
                guildUid: dbGuildMember.guild.snowflake,
                guildMemberUid: dbGuildMember.snowflake,
            });
        }

        await em.flush();
    },
};
