import { PrismaClient } from "@prisma/client";
import DiscordJS from "discord.js";
import { compile } from "handlebars";
import winston from "winston";
import { Discord } from "..";


export class GuildMemberAddEvent {
    private logger: winston.Logger;
    private prisma: PrismaClient;
    private discord: Discord;

    /**
     *
     */
    constructor(logger: winston.Logger, prisma: PrismaClient, discord: Discord) {
        this.logger = logger;
        this.prisma = prisma;
        this.discord = discord;
    }

    async handle(member: DiscordJS.GuildMember) {
        this.logger.debug(`${member.nickname || member.user.username} joined guild ${member.guild.name}`);
        if (member.user.bot) return;

        const databaseGuild = await this.prisma.guild.findUnique({
            where: {
                snowflake: member.guild.id
            },
            include: {
                config: {
                    include: {
                        welcomeMessageConfig: true
                    }
                }
            }
        });
        if (!databaseGuild) throw new Error();
        if (!databaseGuild.config) throw new Error();

        if (!databaseGuild.config.welcomeMessageEnabled) return;
        if (!databaseGuild.config.welcomeMessageConfig) throw new Error();

        const discordGuild = this.discord.guilds.cache.get(databaseGuild.snowflake);
        if (!discordGuild) throw new Error();

        const discordChannel = discordGuild.channels.cache.get(databaseGuild.config.welcomeMessageConfig.channelSnowflake);
        if (!discordChannel) throw new Error();
        if (!discordChannel.isText()) throw new Error();

        const template = compile(databaseGuild.config.welcomeMessageConfig.format);

        await discordChannel.send({
            content: template({
                member
            }, {
                allowProtoPropertiesByDefault: true
            })
        });
    }
}