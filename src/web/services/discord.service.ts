import discord from "@/discord";
import GuildChannelNotFoundError from "@/errors/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "@/errors/GuildChannelNotTextChannelError";
import GuildNotFoundError from "@/errors/GuildNotFoundError";
import MissingParameterError from "@/errors/MissingParameterError";
import { CategoryChannel, GuildChannel, ThreadChannel } from "discord.js";
import { FriendshipBubble } from "typings/FriendshipBubble";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import database from "@/database";
import {
    BuildingBlockType,
    CheckType,
    CommandFlowEntity,
    OnType,
} from "@/database/entities/CommandFlowEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import {
    CommandFlowGroupEntity,
    CommandFlowGroupType,
} from "@/database/entities/CommandFlowGroupEntity";

class DiscordService {
    public async getAllGuilds(): Promise<FriendshipBubble.DiscordBot.Guild[]> {
        const client = discord.getClient();
        const data: FriendshipBubble.DiscordBot.Guild[] = [];

        for (const guild of client.guilds.cache.values()) {
            data.push(guild);
        }

        return data;
    }

    public async getGuild(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
    }): Promise<FriendshipBubble.DiscordBot.Guild> {
        const client = discord.getClient();
        const guilds: FriendshipBubble.DiscordBot.Guild =
            await client.guilds.fetch(data.id);

        return guilds;
    }

    public async getGuildChannels(data: {
        id: FriendshipBubble.DiscordBot.Snowflake;
        type: string;
    }): Promise<FriendshipBubble.DiscordBot.GuildChannel[]> {
        const client = discord.getClient();
        const guildChannels: FriendshipBubble.DiscordBot.GuildChannel[] = [];

        const guild = client.guilds.cache.get(data.id);
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
        const client = discord.getClient();
        const guildMembers: FriendshipBubble.DiscordBot.GuildMember[] = [];

        const guild = client.guilds.cache.get(data.id);
        if (!guild) throw new GuildNotFoundError(data.id);

        for (const member of guild.members.cache.values()) {
            guildMembers.push(member);
        }

        return guildMembers;
    }

    public async sendMessage(data: { channelId: string; message: string }) {
        if (!data.channelId) throw new MissingParameterError("channelId");
        if (!data.message) throw new MissingParameterError("message");

        const client = discord.getClient();
        const channel = client.channels.cache.get(data.channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText())
            throw new GuildChannelNotTextChannelError(data.channelId);

        await channel.send(data.message);
    }

    public async getAllReactionCollectors() {
        const em = database.getORM().em.fork();
        return em.find(CommandFlowGroupEntity, {}, ['commandFlows']);
    }

    public async getReactionCollector(data: { id: number }) {
        const em = database.getORM().em.fork();

        const { id } = data;

        const dbCommandFlowGroup = await em.findOne(CommandFlowGroupEntity, {
            id,
        });
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
        // commandFlows: {
        //     onType: OnType;
        //     buildingBlockType: BuildingBlockType;
        //     options: any;
        //     order: number;
        //     checkType?: CheckType;
        //     checkValue?: any;
        // }[];
    }) {
        const em = database.getORM().em.fork();
        const {
            guildId,
            name,
            description,
            type,
            channelId,
            messageText,
            reactions,
        } = data;

        const dbGuild = await em.findOne(GuildEntity, { uid: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        const discordClient = discord.getClient();
        const channel = discordClient.channels.cache.get(channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText())
            throw new GuildChannelNotTextChannelError(data.channelId);

        const messageSent = await channel.send(messageText);
        for (const reaction of reactions) {
            messageSent.react(reaction);
        }

        // Create a new command flow group
        em.persist(
            new CommandFlowGroupEntity(
                dbGuild,
                name,
                description,
                type,
                messageSent.id,
                channelId,
                messageText,
                reactions
            )
        );

        // for (const commandFlow of commandFlows) {
        //     this.em.persist(new CommandFlowEntity(
        //         dbGuild,
        //         messageSent.id,
        //         commandFlow.onType,
        //         commandFlow.buildingBlockType,
        //         JSON.stringify(commandFlow.options),
        //         commandFlow.order,
        //         commandFlow.checkType,
        //         commandFlow.checkValue
        //     ));
        // }

        // this.em.persist([
        //     new CommandFlowEntity(
        //         dbGuild,
        //         messageSent.id,
        //         OnType.REACTION_ADD,
        //         BuildingBlockType.SEND_MESSAGE,
        //         JSON.stringify({
        //             toType: SendMessageTo.CHANNEL,
        //             to: channelId,
        //             messageFormat: "{{pickFirstName guildMember.nickname }} reacted a 🇧🇪!"
        //         }),
        //         0,
        //         CheckType.REACTION_EMOJI,
        //         "🇧🇪",
        //     ),
        //     new CommandFlowEntity(
        //         dbGuild,
        //         messageSent.id,
        //         OnType.REACTION_ADD,
        //         BuildingBlockType.SEND_MESSAGE,
        //         JSON.stringify({
        //             toType: SendMessageTo.CHANNEL,
        //             to: channelId,
        //             messageFormat: "{{pickFirstName guildMember.nickname }} reacted a 🇳🇱!"
        //         }),
        //         1,
        //         CheckType.REACTION_EMOJI,
        //         "🇳🇱",
        //     )
        // ]);

        await em.flush();
    }

    public async deleteReactionCollector(data: { id: number }) {
        const em = database.getORM().em.fork();

        const { id } = data;

        const dbCommandFlowGroup = await em.findOne(
            CommandFlowGroupEntity,
            {
                id,
            }
        );
        if (!dbCommandFlowGroup) throw new Error("Not found error");

        em.remove(dbCommandFlowGroup.commandFlows);
        await em.flush();

        em.remove(dbCommandFlowGroup);
        await em.flush();

        return null;
    }
}

export default new DiscordService();
