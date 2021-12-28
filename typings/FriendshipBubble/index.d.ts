import DiscordJS from "discord.js";

declare module FriendshipBubble {
    declare module DiscordBot {
        type Snowflake = DiscordJS.Snowflake;

        type Guild = DiscordJS.Guild;
        type ThreadChannel = DiscordJS.ThreadChannel;
        type GuildMember = DiscordJS.GuildMember;
    }
}
