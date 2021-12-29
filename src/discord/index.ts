import { Client, Intents, Interaction } from "discord.js";
import { logger } from "../logger";

// Events
import interactionCreate from "./events/interactionCreate";
import messageReactionAdd from "./events/messageReactionAdd";
import messageReactionRemove from "./events/messageReactionRemove";
import ready from "./events/ready";

export default class Discord {
    protected static instance: Discord | null = null;

    protected client: Client;

    constructor() {
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
            ],
            // partials: ["MESSAGE", "CHANNEL", "REACTION"],
        });

        // Set event handlers
        this.client.once("ready", ready.handle.bind(this));
        this.client.on(
            "interactionCreate",
            interactionCreate.handle.bind(this)
        );

        // TODO: API handle
        // this.client.on(
        //     "messageReactionAdd",
        //     messageReactionAdd.handle.bind(this)
        // );
        // this.client.on(
        //     "messageReactionRemove",
        //     messageReactionRemove.handle.bind(this)
        // );

        this.client.login(process.env.BOT_TOKEN);
    }

    public static getInstance() {
        if (this.instance) return this.instance;

        this.instance = new Discord();
        return this.instance;
    }

    public getClient(): Client {
        return this.client;
    }
}
