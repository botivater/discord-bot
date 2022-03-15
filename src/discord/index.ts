import { Client, Intents } from "discord.js";
import logger from "../logger";

// Events
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";
import messageReactionAdd from "./events/messageReactionAdd";
import messageReactionRemove from "./events/messageReactionRemove";
import ready from "./events/ready";
import voiceStateUpdate from "./events/voiceStateUpdate";

class Discord {
    protected client: Client | null = null;

    public async setup() {
        logger.info("Discord bot is starting up...");

        this.client = new Client({
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
        this.client.once("ready", ready.handle.bind(this));
        this.client.on(
            "interactionCreate",
            interactionCreate.handle.bind(this)
        );

        this.client.on(
            "messageReactionAdd",
            messageReactionAdd.handle.bind(this)
        );

        this.client.on(
            "messageReactionRemove",
            messageReactionRemove.handle.bind(this)
        );

        this.client.on("messageCreate", messageCreate.handle.bind(this));
        this.client.on("voiceStateUpdate", voiceStateUpdate.handle.bind(this));

        this.client.login(process.env.BOT_TOKEN);
    }

    public getClient(): Client {
        if (!this.client) throw new Error("Client is undefined.");
        return this.client;
    }
}

export default new Discord();
