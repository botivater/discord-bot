import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import logger from "@/logger";
import discord from "..";
import Handlebars from "handlebars";
import { memberNicknameMention } from "@discordjs/builders";

export default {
    handle: async () => {
        const date = new Date();

        const discordClient = discord.getClient();
        const em = database.getORM().em.fork();

        const dbGuildMembers = await em.find(
            GuildMemberEntity,
            {
                birthday: date,
            },
            { populate: ["guild"] }
        );

        for (const dbGuildMember of dbGuildMembers) {
            const guild = discordClient.guilds.cache.get(
                dbGuildMember.guild.uid
            );
            if (!guild) {
                logger.verbose("Guild not found in birthday cron job");
                continue;
            }

            const guildMember = guild.members.cache.get(dbGuildMember.uid);
            if (!guildMember) {
                logger.verbose("Guild member not found in birthday cron job");
                continue;
            }

            const guildChannel = guild.channels.cache.get("922866976760684564");
            if (!guildChannel) {
                logger.verbose("Guild channel not found in birthday cron job");
                continue;
            }

            if (!guildChannel.isText()) {
                logger.verbose(
                    "Guild channel not a text channel in birthday cron job"
                );
                continue;
            }

            const options = [
                "Happy birthday to you, {{{ person }}}!",
                "Gelukkige verjaardag, {{{ person }}}!",
                "Er is er één jarig! Happy birthday, {{{ person }}}!",
                "Gefeliciteerd met je verjaardag, {{{ person }}}!",
            ];

            const option = options[Math.floor(Math.random() * options.length)];

            const stringTemplate = Handlebars.compile(option);

            guildChannel.send({
                content: stringTemplate({
                    person: memberNicknameMention(guildMember.id),
                }),
            });
        }
    },
};
