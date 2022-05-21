import GuildChannelNotFoundError from "../../error/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "../../error/GuildChannelNotTextChannelError";
import GuildNotFoundError from "../../error/GuildNotFoundError";
import MissingParameterError from "../../error/MissingParameterError";
import {
    CategoryChannel,
    GuildChannel,
    Message,
    ThreadChannel,
} from "discord.js";
import { FriendshipBubble } from "../../../typings/FriendshipBubble";
import { PrismaClient } from "@prisma/client";
import { CommandFlowGroupType } from "../../../common/CommandFlowGroupType";
import { BuildingBlockType } from "../../../common/BuildingBlockType";
import { OnType } from "../../../common/OnType";
import { CheckType } from "../../../common/CheckType";
import { Discord } from "../../../discord";


export class DiscordService {
    private prisma: PrismaClient;
    private discord: Discord;

    /**
     * @param prisma Inject an instance of PrismaClient.
     * @param discord Inject an instance of Discord.
     */
    constructor(prisma: PrismaClient, discord: Discord) {
        this.prisma = prisma;
        this.discord = discord;
    }

    public async getAllGuilds(): Promise<FriendshipBubble.DiscordBot.Guild[]> {
        const data: FriendshipBubble.DiscordBot.Guild[] = [];

        for (const guild of this.discord.guilds.cache.values()) {
            data.push(guild);
        }

        return data;
    }

    public async getGuild(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
    }): Promise<FriendshipBubble.DiscordBot.Guild> {
        const guilds: FriendshipBubble.DiscordBot.Guild =
            await this.discord.guilds.fetch(data.id);

        return guilds;
    }

    public async getGuildChannels(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
        type: string;
    }): Promise<FriendshipBubble.DiscordBot.GuildChannel[]> {
        const guildChannels: FriendshipBubble.DiscordBot.GuildChannel[] = [];

        const guild = this.discord.guilds.cache.get(data.id);
        if (!guild) throw new GuildNotFoundError(data.id);

        for (const channel of guild.channels.cache.values()) {
            if (channel.isThread()) continue;
            if (channel instanceof CategoryChannel) continue;
            if (data.type === "text" && !channel.isText()) continue;
            if (data.type === "voice" && !channel.isVoice()) continue;

            guildChannels.push(<GuildChannel>channel);
        }

        return guildChannels;
    }

    public async getGuildMembers(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
    }): Promise<FriendshipBubble.DiscordBot.GuildMember[]> {
        const guildMembers: FriendshipBubble.DiscordBot.GuildMember[] = [];

        const guild = this.discord.guilds.cache.get(data.id);
        if (!guild) throw new GuildNotFoundError(data.id);

        for (const member of guild.members.cache.values()) {
            guildMembers.push(member);
        }

        return guildMembers;
    }

    public async getGuildRoles(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
    }): Promise<FriendshipBubble.DiscordBot.Role[]> {
        const guildRoles: FriendshipBubble.DiscordBot.Role[] = [];

        const guild = this.discord.guilds.cache.get(data.id);
        if (!guild) throw new GuildNotFoundError(data.id);

        for (const role of guild.roles.cache.values()) {
            guildRoles.push(role);
        }

        return guildRoles;
    }

    public async sendMessage(data: { channelId: string; message: string }) {
        if (!data.channelId) throw new MissingParameterError("channelId");
        if (!data.message) throw new MissingParameterError("message");

        const channel = this.discord.channels.cache.get(data.channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText())
            throw new GuildChannelNotTextChannelError(data.channelId);

        await channel.send(data.message);
    }

    public async getAllReactionCollectors() {
        return this.prisma.commandFlowGroup.findMany({
            include: {
                commandFlows: true
            }
        });
    }

    public async getReactionCollector(data: { id: number }) {
        const { id } = data;

        const dbCommandFlowGroup = await this.prisma.commandFlowGroup.findFirst({
            where: {
                id: {
                    equals: id
                }
            },
            include: {
                commandFlows: true
            }
        })
        if (!dbCommandFlowGroup) throw new Error("Not found error");

        return dbCommandFlowGroup;
    }

    public async storeReactionCollector(data: {
        guildId: string;
        name: string;
        description: string;
        type: CommandFlowGroupType;
        channelId: string;
        messageText: string;
        reactions: string[];
        commandFlows: {
            onType: OnType;
            buildingBlockType: BuildingBlockType;
            options: any;
            order: number;
            checkType?: CheckType;
            checkValue?: any;
        }[];
    }) {
        const {
            guildId,
            name,
            description,
            type,
            channelId,
            messageText,
            reactions,
            commandFlows,
        } = data;

        const dbGuild = await this.prisma.guild.findFirst({
            where: {
                snowflake: guildId
            }
        });
        if (!dbGuild) throw new GuildNotFoundError();

        const channel = this.discord.channels.cache.get(channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText())
            throw new GuildChannelNotTextChannelError(data.channelId);

        const messageSent = await channel.send(messageText);
        for (const reaction of reactions) {
            messageSent.react(reaction);
        }

        const commandFlowGroup = await this.prisma.commandFlowGroup.create({
            data: {
                guildId: dbGuild.id,
                name,
                description,
                type,
                messageId: messageSent.id,
                channelId,
                messageText,
                reactions
            }
        });

        for await (const commandFlow of commandFlows) {
            await this.prisma.commandFlow.create({
                data: {
                    commandFlowGroup: {
                        connect: {
                            id: commandFlowGroup.id
                        }
                    },
                    onType: commandFlow.onType,
                    buildingBlockType: commandFlow.buildingBlockType,
                    options: JSON.stringify(commandFlow.options),
                    order: commandFlow.order,
                    checkType: commandFlow.checkType,
                    checkValue: commandFlow.checkValue
                }
            });
        }
    }

    public async deleteReactionCollector(data: { id: number }) {
        const { id } = data;

        const dbCommandFlowGroup = await this.prisma.commandFlowGroup.findFirst({
            where: {
                id: {
                    equals: id
                }
            },
            include: {
                commandFlows: true
            }
        })
        if (!dbCommandFlowGroup) throw new Error("Not found error");

        const channel = this.discord.channels.cache.get(
            dbCommandFlowGroup.channelId
        );
        if (!channel)
            throw new GuildChannelNotFoundError(dbCommandFlowGroup.channelId);
        if (!channel.isText())
            throw new GuildChannelNotTextChannelError(
                dbCommandFlowGroup.channelId
            );

        await channel.messages.fetch();
        const message = channel.messages.cache.get(
            dbCommandFlowGroup.messageId
        );
        if (message) {
            await message.delete();
        }

        for await (const commandFlow of dbCommandFlowGroup.commandFlows) {
            await this.prisma.commandFlow.delete({
                where: {
                    id: commandFlow.id
                }
            });
        }

        await this.prisma.commandFlowGroup.delete({
            where: {
                id: dbCommandFlowGroup.id
            }
        });

        return null;
    }
}
