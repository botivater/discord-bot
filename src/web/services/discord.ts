import FriendshipBubbleDiscordBot from "@/index";

export const speak = async (channelId: string, message: string) => {
    if (!channelId || !message) throw new Error("Missing parameter");

    const client = FriendshipBubbleDiscordBot.getDiscord().getClient();
    const channel = client.channels.cache.get(channelId);
    if (!channel) throw new Error("Channel not found");
    if (!channel.isText()) throw new Error("Channel is not a text channel");

    await channel.send(message);
};
