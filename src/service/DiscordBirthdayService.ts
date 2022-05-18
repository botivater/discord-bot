import logger from "../logger";
import Discord from "discord.js";
import { GuildMember, PrismaClient } from "@prisma/client";
import { userMention } from "@discordjs/builders";
import Handlebars from "handlebars";

// Errors
import { DiscordGuildNotFoundError } from "../error/DiscordGuildNotFoundError";
import { DiscordGuildMemberNotFoundError } from "../error/DiscordGuildMemberNotFoundError";
import { DiscordGuildChannelNotFoundError } from "../error/DiscordGuildChannelNotFoundError";
import { DiscordGuildChannelNotTextError } from "../error/DiscordGuildChannelNotTextError";

export class DiscordBirthdayService {
    private discordClient: Discord.Client;
    private prisma: PrismaClient;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client, prisma: PrismaClient) {
        this.discordClient = discordClient;
        this.prisma = prisma;
    }

    public async handle() {
        await this.discordClient.guilds.fetch();

        const databaseGuildMembers = <GuildMember[]> await this.prisma.$queryRaw`SELECT * FROM GuildMember WHERE DATE_FORMAT(birthday, '%m-%d') = DATE_FORMAT(NOW(), '%m-%d')`;

        for await (const databaseGuildMember of databaseGuildMembers) {
            try {
                const databaseGuild = await this.prisma.guild.findFirst({
                    where: {
                        id: {
                            equals: databaseGuildMember.id
                        }
                    }
                });
                if (!databaseGuild) throw new Error("Guild not found in database.");

                const discordGuild = this.discordClient.guilds.cache.get(databaseGuild.snowflake);
                if (!discordGuild) throw new DiscordGuildNotFoundError(databaseGuild.snowflake);

                await discordGuild.members.fetch();

                const discordGuildMember = discordGuild.members.cache.get(databaseGuildMember.snowflake);
                if (!discordGuildMember) throw new DiscordGuildMemberNotFoundError(databaseGuildMember.snowflake);

                await discordGuild.channels.fetch();

                const discordGuildChannel = discordGuild.channels.cache.get("973589943416922165");
                if (!discordGuildChannel) throw new DiscordGuildChannelNotFoundError("973589943416922165");
                if (!discordGuildChannel.isText()) throw new DiscordGuildChannelNotTextError("973589943416922165");

                const options = [
                    "Happy birthday to you, {{{ person }}}!",
                    "Gelukkige verjaardag, {{{ person }}}!",
                    "Er is er één jarig! Happy birthday, {{{ person }}}!",
                    "Gefeliciteerd met je verjaardag, {{{ person }}}!",
                ];

                const option = options[Math.floor(Math.random() * options.length)];

                const stringTemplate = Handlebars.compile(option);

                discordGuildChannel.send({
                    content: stringTemplate({
                        person: userMention(discordGuildMember.id),
                    }),
                });

                logger.debug(`Sent birthday message of user: ${databaseGuildMember.name} (${databaseGuildMember.identifier}).`);

            } catch (e) {
                e instanceof Error ? logger.error(`${e.name}\n${e.message}\n${e.stack}`) : logger.error(e);
            }
        }
    }
}