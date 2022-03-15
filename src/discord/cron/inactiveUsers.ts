import Config from "@/common/config";
import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import logger from "@/logger";
import { bold, italic, userMention } from "@discordjs/builders";
import discord from "..";

// Timeout in seconds.
// 60 => 60 seconds
// 60 * 60 => 60 minutes
// 60 * 60 * 24 => 24 hours
// 60 * 60 * 24 * 7 => 7 days
// 60 * 60 * 24 * 182 => 182 days (aprox. 6 months)
const timeoutSeconds = 60 * 60 * 24 * 182;

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

        const guildChannel = guild.channels.cache.get(
            Config.getSystemChannelId()
        );
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
                `Setting user '${dbGuildMember.name}' with uid '${dbGuildMember.uid}' to inactive.`
            );

            let message = `${bold("Ik heb iemand op non-actief gezet.")}\r\n`;
            message += `Gebruiker: ${userMention(dbGuildMember.uid)}\r\n`;
            message += `Laatste interactie: ${dbGuildMember.lastInteraction.toLocaleDateString(
                "nl-NL",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            )}`;
            message += `${italic('Dit onderdeel staat nog in testmodus, er is dus niemand een rol toegewezen.')}`

            guildChannel.send({
                content: message,
                allowedMentions: {
                    parse: [],
                },
            });

            dbGuildMember.active = false;
            em.persist(dbGuildMember);
        }

        await em.flush();
    },
};
