import FriendshipBubbleDiscordBot from "@/index";
import { CategoryChannel, GuildChannel, ThreadChannel } from "discord.js";
import { FriendshipBubble } from "typings/FriendshipBubble";

export const speak = async (channelId: string, message: string) => {
    if (!channelId || !message) throw new Error("Missing parameter");

    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const channel = client.channels.cache.get(channelId);
    if (!channel) throw new Error("Channel not found");
    if (!channel.isText()) throw new Error("Channel is not a text channel");

    await channel.send(message);
};

export const getAllGuilds = async (): Promise<
    FriendshipBubble.DiscordBot.Guild[]
> => {
    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const data: FriendshipBubble.DiscordBot.Guild[] = [];

    for (const guild of client.guilds.cache.values()) {
        data.push(guild);
    }

    return data;
};

export const getGuild = async (
    id: FriendshipBubble.DiscordBot.Snowflake
): Promise<FriendshipBubble.DiscordBot.Guild> => {
    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const data: FriendshipBubble.DiscordBot.Guild = await client.guilds.fetch(
        id
    );

    return data;
};

export const getGuildChannels = async (
    id: FriendshipBubble.DiscordBot.Snowflake,
    type: string
): Promise<FriendshipBubble.DiscordBot.GuildChannel[]> => {
    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const data: FriendshipBubble.DiscordBot.GuildChannel[] = [];

    const guild = client.guilds.cache.get(id);
    if (!guild) throw new Error("Guild not found.");

    for (const channel of guild.channels.cache.values()) {
        if (channel.isThread()) continue;
        if (channel instanceof CategoryChannel) continue;
        if (type === "text" && !channel.isText()) continue;
        if (type === "voice" && !channel.isVoice()) continue;

        data.push(<GuildChannel>channel);
    }

    return data;
};

export const getGuildMembers = async (
    id: FriendshipBubble.DiscordBot.Snowflake
): Promise<FriendshipBubble.DiscordBot.GuildMember[]> => {
    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const data: FriendshipBubble.DiscordBot.GuildMember[] = [];

    const guild = client.guilds.cache.get(id);
    if (!guild) throw new Error("Guild not found.");

    for (const member of guild.members.cache.values()) {
        data.push(member);
    }

    return data;
};
