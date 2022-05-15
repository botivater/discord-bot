import { IMessageChannel } from "./IMessageChannel";
import Discord from "discord.js";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { DiscordGuildNotFoundError } from "@/error/DiscordGuildNotFoundError";
import { DiscordGuildChannelNotTextError } from "@/error/DiscordGuildChannelNotTextError";

export class DiscordSystemMessageChannel implements IMessageChannel {
    private discordClient: Discord.Client;
    private databaseGuild: GuildEntity;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     * @param databaseGuild Database guild to act upon.
     */
    constructor(discordClient: Discord.Client, databaseGuild: GuildEntity) {
        this.discordClient = discordClient;
        this.databaseGuild = databaseGuild;
    }

    /**
     * Send a message.
     * @param message Message to send.
     * @throws DiscordGuildNotFoundError
     * @throws DiscordGuildChannelNotTextError
     */
    async send(message: string): Promise<void> {
        await this.discordClient.guilds.fetch(this.databaseGuild.snowflake);

        const discordGuild = this.discordClient.guilds.cache.get(this.databaseGuild.snowflake);
        if (!discordGuild) throw new DiscordGuildNotFoundError(this.databaseGuild.snowflake);

        await discordGuild.channels.fetch();
        
        let discordChannel = discordGuild.channels.cache.find(channel => channel.name === "systeem");
        if (!discordChannel) {
            discordChannel = await discordGuild.channels.create("systeem", {
                type: "GUILD_TEXT"
            });
        }

        if (!discordChannel.isText()) throw new DiscordGuildChannelNotTextError(discordChannel.id);
        await discordChannel.send({
            content: message,
            allowedMentions: {
                parse: []
            }
        });
    }    
}