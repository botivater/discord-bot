import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { DiscordGuildNotFoundError } from "@/error/DiscordGuildNotFoundError";
import logger from "@/logger";
import GuildEntityRepository from "@/repository/GuildEntityRepository";
import GuildMemberEntityRepository from "@/repository/GuildMemberEntityRepository";
import Discord from "discord.js";

export class DiscordSyncService {
    private discordClient: Discord.Client;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;
    }

    public async handle() {
        // Do a bi-directional compare of the guilds and guild members.

        // Fetch all Discord guilds to the cache
        await this.discordClient.guilds.fetch();

        // Bot has been removed from a guild
        const removeableGuilds = await this.compareDatabaseGuildsToDiscordGuilds();
        logger.debug(`Removeable guilds: ${removeableGuilds.map(v => `${v.name} (${v.id})`)}`);
        await GuildEntityRepository.getRepository().removeAndFlush(removeableGuilds);

        // Bot has been added to a guild
        const addableGuilds = await this.compareDiscordGuildsToDatabaseGuilds();
        logger.debug(`Addable guilds: ${addableGuilds.map(v => `${v.name} (${v.id})`)}`);
        await GuildEntityRepository.getRepository().persistAndFlush(addableGuilds);

        // Fetch all Discord guilds members to the cache
        await Promise.all(this.discordClient.guilds.cache.map(discordGuild => discordGuild.members.fetch()));

        // Guild member has left a guild
        const removeableGuildMembers = await this.compareDatabaseGuildMembersToDiscordGuildMembers();
        logger.debug(`Removeable guild members: ${removeableGuildMembers.map(v => `${v.name} (${v.id})`)}`);
        await GuildMemberEntityRepository.getRepository().persistAndFlush(removeableGuildMembers);

        // Guild member has joined a guild
        const addableGuildMembers = await this.compareDiscordGuildMembersToDatabaseGuildMembers();
        logger.debug(`Addable guild members: ${removeableGuildMembers.map(v => `${v.name} (${v.id})`)}`);
        await GuildMemberEntityRepository.getRepository().persistAndFlush(addableGuildMembers);
    }

    private async compareDatabaseGuildsToDiscordGuilds(): Promise<GuildEntity[]> {
        const removeableGuilds: GuildEntity[] = [];
        const databaseGuilds = await GuildEntityRepository.getRepository().findAll();

        for (const databaseGuild of databaseGuilds) {
            const found = this.discordClient.guilds.cache.find(guild => guild.id === databaseGuild.snowflake);
            if (!found) removeableGuilds.push(databaseGuild);
        }

        return removeableGuilds;
    }

    private async compareDiscordGuildsToDatabaseGuilds(): Promise<GuildEntity[]> {
        const addableGuilds: GuildEntity[] = [];

        for await (const discordGuild of this.discordClient.guilds.cache.values()) {
            const found = await GuildEntityRepository.getRepository().findOne({
                snowflake: discordGuild.id
            });

            if (!found) addableGuilds.push(new GuildEntity(discordGuild.id, discordGuild.name));
        }

        return addableGuilds;
    }

    private async compareDatabaseGuildMembersToDiscordGuildMembers(): Promise<GuildMemberEntity[]> {
        const removeableGuildMembers: GuildMemberEntity[] = [];

        const databaseGuilds = await GuildEntityRepository.getRepository().findAll({ populate: ['guildMembers'] });
        for (const databaseGuild of databaseGuilds) {
            for (const databaseGuildMember of databaseGuild.guildMembers) {
                try {
                    const discordGuild = this.discordClient.guilds.cache.get(databaseGuild.snowflake);
                    if (!discordGuild) throw new DiscordGuildNotFoundError(databaseGuild.snowflake);

                    const found = discordGuild.members.cache.find(guildMember => guildMember.id === databaseGuildMember.snowflake);
                    if (!found) removeableGuildMembers.push(databaseGuildMember);
                } catch (e) {
                    logger.error(e);
                }
            }
        }

        return removeableGuildMembers;
    }

    private async compareDiscordGuildMembersToDatabaseGuildMembers(): Promise<GuildMemberEntity[]> {
        const addableGuildMembers: GuildMemberEntity[] = [];

        for await (const discordGuild of this.discordClient.guilds.cache.values()) {
            try {
                const databaseGuild = await GuildEntityRepository.getRepository().findOne({
                    snowflake: discordGuild.id
                });
                if (!databaseGuild) throw new Error("Database guild not found!");

                for await (const discordGuildMember of discordGuild.members.cache.values()) {
                    if (discordGuildMember.user.bot) continue;
                    const found = await GuildMemberEntityRepository.getRepository().findOne({
                        snowflake: discordGuildMember.id
                    });

                    if (!found) {
                        const nickname = discordGuildMember.nickname || discordGuildMember.user.username || "";
                        addableGuildMembers.push(new GuildMemberEntity(discordGuildMember.id, databaseGuild, nickname, discordGuildMember.user.tag));
                    }
                }
            } catch (e) {
                logger.error(e);
            }
        }

        return addableGuildMembers;
    }
}