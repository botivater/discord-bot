import { CacheType, Client, Intents, Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { inlineCode } from "@discordjs/builders";
import Config from "../common/config";
import { logger } from "../logger";
import { syncAllUsersInAllGuilds } from "./sync";

// Commands
import ping from "./commands/ping";
import cat from "./commands/cat";
import selfcare from "./commands/selfcare";
import toneindicator from "./commands/toneindicator";
import dev from "./commands/dev";
import findafriend from "./commands/findafriend";
import whatareyouthinkingabout from "./commands/whatareyouthinkingabout";

export default class Discord {
    // eslint-disable-next-line no-use-before-define
    protected static instance: Discord | null = null;

    protected client: Client;

    constructor() {
        logger.info("Discord bot is starting up.");

        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_PRESENCES
            ],
        });

        this.registerCommands();

        this.client.once("ready", Discord.handleReadyEvent);
        this.client.on("interactionCreate", Discord.handleInteractionCreate);

        this.client.login(process.env.BOT_TOKEN);
    }

    protected static async handleReadyEvent() {
        const client = Discord.getInstance().client;

        const channel = client.channels.cache.get(
            Config.getSystemChannelId()
        );

        if (channel && channel.isText()) {
            channel.send(`Miauw! Revision: ${inlineCode(Config.getRevisionId())}`);
        }

        client?.user?.setPresence({
            activities: [{ name: "Lauri", type: "LISTENING" }],
        });

        syncAllUsersInAllGuilds(client);

        setInterval(() => {
            const discordClient = Discord.getInstance().client;

            syncAllUsersInAllGuilds(discordClient);
        }, 60000);

        logger.info("Discord bot is ready.");
    }

    protected static async handleInteractionCreate(
        interaction: Interaction<CacheType>
    ) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        switch (commandName) {
            case ping.command.name:
                await ping.handle(interaction);
                break;

            case cat.command.name:
                await cat.handle(interaction);
                break;

            case findafriend.command.name:
                await findafriend.handle(interaction);
                break;

            case selfcare.command.name:
                await selfcare.handle(interaction);
                break;

            case whatareyouthinkingabout.command.name:
                await whatareyouthinkingabout.handle(interaction);
                break;

            case toneindicator.command.name:
                await toneindicator.handle(interaction);
                break;

            case dev.command.name:
                await dev.handle(interaction);
                break;

            default:
                break;
        }
    }

    protected registerCommands() {
        const commands = [
            ping.command,
            cat.command,
            findafriend.command,
            selfcare.command,
            whatareyouthinkingabout.command,
            toneindicator.command,
            dev.command,
        ].map((command) =>
            command.toJSON()
        );

        // Register commands
        const rest = new REST({ version: "9" }).setToken(Config.getBotToken());

        // Globally register commands
        rest.put(Routes.applicationCommands(Config.getApplicationId()), {
            body: [],
        });

        // Prod server commands
        // TODO: Remove me!
        rest.put(
            Routes.applicationGuildCommands(
                Config.getApplicationId(),
                "803327192662671463"
            ),
            {
                body: commands,
            }
        );
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
