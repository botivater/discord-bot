import { Client, Intents } from "discord.js";
import logger from "../logger";

// Events
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";
import messageReactionAdd from "./events/messageReactionAdd";
import messageReactionRemove from "./events/messageReactionRemove";
import ready from "./events/ready";
import voiceStateUpdate from "./events/voiceStateUpdate";

export class Discord extends Client {
    /**
     *
     */
    constructor() {
        logger.info("Discord bot initializing");
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_VOICE_STATES,
            ],
            partials: ["MESSAGE", "CHANNEL", "REACTION"],
        });

        // Set event handlers
        this.once("ready", ready.handle.bind(this));
        this.on(
            "interactionCreate",
            interactionCreate.handle.bind(this)
        );

        this.on(
            "messageReactionAdd",
            messageReactionAdd.handle.bind(this)
        );

        this.on(
            "messageReactionRemove",
            messageReactionRemove.handle.bind(this)
        );

        this.on("messageCreate", messageCreate.handle.bind(this));
        this.on("voiceStateUpdate", voiceStateUpdate.handle.bind(this));

        logger.info("Discord bot is initialized");
    }

    public async setup() {
        await this.login(process.env.BOT_TOKEN);
        logger.info("Discord bot is logged in");
    }
}
