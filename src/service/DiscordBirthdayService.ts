import logger from "../logger";
import Discord from "discord.js";
import { userMention } from "@discordjs/builders";
import database from "src/database";
import { EntityManager } from "@mikro-orm/mysql";
import { GuildMemberEntity } from "src/database/entities/GuildMemberEntity";
import Handlebars from "handlebars";

// Errors
import { DiscordGuildNotFoundError } from "../error/DiscordGuildNotFoundError";
import { DiscordGuildMemberNotFoundError } from "src/error/DiscordGuildMemberNotFoundError";
import { DiscordGuildChannelNotFoundError } from "src/error/DiscordGuildChannelNotFoundError";
import { DiscordGuildChannelNotTextError } from "src/error/DiscordGuildChannelNotTextError";

export class DiscordBirthdayService {
    private discordClient: Discord.Client;
    private entityManager: EntityManager;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;
        this.entityManager = <EntityManager> database.getORM().em.fork();
    }

    public async handle() {
        await this.discordClient.guilds.fetch();

        const queryBuilder = this.entityManager.createQueryBuilder(GuildMemberEntity);
        const databaseGuildMembers = await queryBuilder.select("*").where("DATE_FORMAT(birthday,'%m-%d') = DATE_FORMAT(NOW(),'%m-%d')").getResult();
        await this.entityManager.populate(databaseGuildMembers, ['guild']);

        for await (const databaseGuildMember of databaseGuildMembers) {
            try {
                const discordGuild = this.discordClient.guilds.cache.get(databaseGuildMember.guild.snowflake);
                if (!discordGuild) throw new DiscordGuildNotFoundError(databaseGuildMember.guild.snowflake);

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