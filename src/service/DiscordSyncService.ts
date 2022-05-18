import { DiscordGuildNotFoundError } from "../error/DiscordGuildNotFoundError";
import logger from "../logger";
import Discord from "discord.js";
import { Guild, GuildMember, PrismaClient } from "@prisma/client";

export class DiscordSyncService {
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
        // Do a bi-directional compare of the guilds and guild members.

        // Fetch all Discord guilds to the cache
        await this.discordClient.guilds.fetch();

        // Bot has been removed from a guild
        const removeableGuilds = await this.compareDatabaseGuildsToDiscordGuilds();
        logger.debug(`Removeable guilds: ${removeableGuilds.map(v => `${v.name} (${v.snowflake})`)}`);
        for await (const removeableGuild of removeableGuilds) {
            await this.prisma.guild.delete({
                where: {
                    id: removeableGuild.id
                }
            })
        }

        // Bot has been added to a guild
        const addableGuilds = await this.compareDiscordGuildsToDatabaseGuilds();
        logger.debug(`Addable guilds: ${addableGuilds.map(v => `${v.name} (${v.snowflake})`)}`);
        for await (const addableGuild of addableGuilds) {
            await this.prisma.guild.create({
                data: {
                    ...addableGuild,
                    config: {
                        create: {}
                    }
                }
            });
        }

        // Fetch all Discord guilds members to the cache
        await Promise.all(this.discordClient.guilds.cache.map(discordGuild => discordGuild.members.fetch()));

        // Guild member has left a guild
        const removeableGuildMembers = await this.compareDatabaseGuildMembersToDiscordGuildMembers();
        logger.debug(`Removeable guild members: ${removeableGuildMembers.map(v => `${v.name} (${v.snowflake})`)}`);
        for await (const removeableGuildMember of removeableGuildMembers) {
            await this.prisma.guildMember.delete({
                where: {
                    id: removeableGuildMember.id
                }
            });
        }

        // Guild member has joined a guild
        const addableGuildMembers = await this.compareDiscordGuildMembersToDatabaseGuildMembers();
        logger.debug(`Addable guild members: ${addableGuildMembers.map(v => `${v.name} (${v.snowflake})`)}`);
        for await (const addableGuildMember of addableGuildMembers) {
            await this.prisma.guildMember.create({
                data: {
                    snowflake: addableGuildMember.snowflake,
                    guild: {
                        connect: {
                            snowflake: addableGuildMember.guildSnowflake
                        }
                    },
                    name: addableGuildMember.name,
                    identifier: addableGuildMember.identifier
                }
            });
        }
    }

    private async compareDatabaseGuildsToDiscordGuilds(): Promise<Guild[]> {
        const removeableGuilds: Guild[] = [];
        const databaseGuilds = await this.prisma.guild.findMany();

        for (const databaseGuild of databaseGuilds) {
            const found = this.discordClient.guilds.cache.find(guild => guild.id === databaseGuild.snowflake);
            if (!found) removeableGuilds.push(databaseGuild);
        }

        return removeableGuilds;
    }

    private async compareDiscordGuildsToDatabaseGuilds(): Promise<{ snowflake: string; name: string; }[]> {
        const addableGuilds: { snowflake: string; name: string; }[] = [];

        for await (const discordGuild of this.discordClient.guilds.cache.values()) {
            const found = await this.prisma.guild.findFirst({
                where: {
                    snowflake: discordGuild.id
                }
            });

            if (!found) addableGuilds.push({
                snowflake: discordGuild.id,
                name: discordGuild.name
            });
        }

        return addableGuilds;
    }

    private async compareDatabaseGuildMembersToDiscordGuildMembers(): Promise<GuildMember[]> {
        const removeableGuildMembers: GuildMember[] = [];

        const databaseGuilds = await this.prisma.guild.findMany({
            include: {
                guildMembers: true
            }
        });
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

    private async compareDiscordGuildMembersToDatabaseGuildMembers(): Promise<{ snowflake: string; guildSnowflake: string; name: string; identifier: string; }[]> {
        const addableGuildMembers: { snowflake: string; guildSnowflake: string; name: string; identifier: string; }[] = [];

        for await (const discordGuild of this.discordClient.guilds.cache.values()) {
            try {
                const databaseGuild = await this.prisma.guild.findFirst({
                    where: {
                        snowflake: discordGuild.id
                    }
                });
                if (!databaseGuild) throw new Error("Database guild not found!");

                for await (const discordGuildMember of discordGuild.members.cache.values()) {
                    if (discordGuildMember.user.bot) continue;
                    const found = await this.prisma.guildMember.findFirst({
                        where: {
                            snowflake: discordGuildMember.id
                        }
                    });

                    if (!found) {
                        const nickname = discordGuildMember.nickname || discordGuildMember.user.username || "";
                        addableGuildMembers.push({
                            snowflake: discordGuildMember.id,
                            guildSnowflake: databaseGuild.snowflake,
                            name: nickname,
                            identifier: discordGuildMember.user.tag
                        });
                    }
                }
            } catch (e) {
                logger.error(e);
            }
        }

        return addableGuildMembers;
    }
}