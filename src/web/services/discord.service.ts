import discord from "@/discord";
import GuildChannelNotFoundError from "@/errors/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "@/errors/GuildChannelNotTextChannelError";
import GuildNotFoundError from "@/errors/GuildNotFoundError";
import MissingParameterError from "@/errors/MissingParameterError";
import { CategoryChannel, GuildChannel, ThreadChannel } from "discord.js";
import { FriendshipBubble } from "typings/FriendshipBubble";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import database from "@/database";
import { CommandFlowEntity } from "@/database/entities/CommandFlowEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { OnType } from "@/discord/events/buildingBlocks/OnType";
import { BuildingBlockType } from "@/discord/events/buildingBlocks/BuildingBlockType";
import { CheckType } from "@/discord/events/buildingBlocks/CheckType";

class DiscordService {
    protected em: EntityManager<IDatabaseDriver<Connection>> | undefined =
        undefined;

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

    public async sendMessage(data: {
        channelId: string;
        message: string;
    }) {
        if (!data.channelId) throw new MissingParameterError("channelId");
        if (!data.message) throw new MissingParameterError("message");
    
        const client = discord.getClient();
        const channel = client.channels.cache.get(data.channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText()) throw new GuildChannelNotTextChannelError(data.channelId);
    
        await channel.send(data.message);
    }

    public async getAllReactionCollectors() {
        if (!this.em) this.em = database.getORM().em.fork();
        return this.em.find(CommandFlowEntity, {});
    }

    public async getReactionCollector(data: { id: number; }) {
        if (!this.em) this.em = database.getORM().em.fork();

        const { id } = data;

        const dbCommandFlow = await this.em.findOne(CommandFlowEntity, {
            id,
        });
        if (!dbCommandFlow) throw new Error("Not found error");

        return dbCommandFlow;
    }

    public async storeReactionCollector(data: {
        guildId: number;
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
        if (!this.em) this.em = database.getORM().em.fork();
        const { guildId, channelId, messageText, reactions, commandFlows } = data;

        const dbGuild = await this.em.findOne(GuildEntity, { id: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        const discordClient = discord.getClient();
        const channel = discordClient.channels.cache.get(channelId);
        if (!channel) throw new GuildChannelNotFoundError(data.channelId);
        if (!channel.isText()) throw new GuildChannelNotTextChannelError(data.channelId);

        const messageSent = await channel.send(messageText);
        for (const reaction of reactions) {
            messageSent.react(reaction);
        }

        for (const commandFlow of commandFlows) {
            this.em.persist(new CommandFlowEntity(
                dbGuild,
                messageSent.id,
                commandFlow.onType,
                commandFlow.buildingBlockType,
                JSON.stringify(commandFlow.options),
                commandFlow.order,
                commandFlow.checkType,
                commandFlow.checkValue
            ));
        }

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

        await this.em.flush();
    }

    public async deleteReactionCollector(data: { id: number; }) {
        if (!this.em) this.em = database.getORM().em.fork();

        const { id } = data;

        const dbCommandFlow = await this.em.findOne(CommandFlowEntity, {
            id,
        });
        if (!dbCommandFlow) throw new Error("Not found error");

        this.em.remove(dbCommandFlow);

        await this.em.flush();

        return null;
    }
}

export default new DiscordService();
