import { Discord } from "..";

// Events
import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";
import messageReactionAdd from "./messageReactionAdd";
import messageReactionRemove from "./messageReactionRemove";
import voiceStateUpdate from "./voiceStateUpdate";
import { GuildMemberAddEvent } from "./guildMemberAdd.event";

export class DiscordEventManager {
    private discord: Discord;
    private guildMemberAddEvent: GuildMemberAddEvent;

    /**
     *
     */
    constructor(discord: Discord, guildMemberAddEvent: GuildMemberAddEvent) {
        this.discord = discord;
        this.guildMemberAddEvent = guildMemberAddEvent;

        // Set event handlers
        this.discord.once("ready", interactionCreate.registerCommands.bind(this));
        this.discord.on(
            "interactionCreate",
            interactionCreate.handle.bind(this)
        );

        this.discord.on(
            "messageReactionAdd",
            messageReactionAdd.handle.bind(this)
        );

        this.discord.on(
            "messageReactionRemove",
            messageReactionRemove.handle.bind(this)
        );

        this.discord.on("messageCreate", messageCreate.handle.bind(this));
        this.discord.on("voiceStateUpdate", voiceStateUpdate.handle.bind(this));

        this.discord.on("guildMemberAdd", this.guildMemberAddEvent.handle.bind(guildMemberAddEvent));
    }
}