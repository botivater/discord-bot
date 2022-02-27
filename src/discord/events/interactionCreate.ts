import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js/node_modules/discord-api-types";
import {
    ApplicationCommandPermissionData,
    CacheType,
    Client,
    GuildApplicationCommandPermissionData,
    Interaction,
} from "discord.js";
import Config, { BotMode } from "@/common/config";
import logger from "@/logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import database from "@/database";
import { CommandListEntity } from "@/database/entities/CommandListEntity";

// Commands
import ping from "../commands/ping";
import toneindicator from "../commands/toneindicator";
import dev from "../commands/dev";
import findafriend from "../commands/findafriend";
import statistics from "../commands/statistics";
import setBirthday from "../commands/set-birthday";
import logUsage from "../helpers/logUsage";
import recreateFlows from "../commands/recreate-flows";

export type CommandMap = {
    [index: string]: (interaction: Interaction) => Promise<void>;
};

export type CommandSignature = {
    command: SlashCommandBuilder;
    handle: (interaction: Interaction) => Promise<void>;
};

let commandMap: CommandMap = {};
let restCommandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

const handle = async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandMap.hasOwnProperty(commandName)) {
            commandMap[commandName](interaction);
        }
    }
};

const registerCommand = (command: CommandSignature) => {
    restCommandArray.push(command.command.toJSON());
    commandMap[command.command.name] = command.handle;
};

const registerCommands = async (client: Client) => {
    commandMap = {};
    restCommandArray = [];

    registerCommand(ping);
    registerCommand(findafriend);
    registerCommand(toneindicator);
    registerCommand(dev);
    registerCommand(statistics);
    registerCommand(setBirthday);
    // registerCommand(recreateFlows);

    // Register database commands
    const orm = database.getORM();
    const commandListRepository = orm.em
        .fork()
        .getRepository(CommandListEntity);
    const commandListEntities = await commandListRepository.find({});
    for (const commandListEntity of commandListEntities) {
        let command = {
            command: new SlashCommandBuilder()
                .setName(commandListEntity.name)
                .setDescription(commandListEntity.description)
                .setDefaultPermission(false),
            async handle(interaction: Interaction) {
                if (!interaction.isCommand()) return;

                await interaction.deferReply();

                try {
                    const randomText =
                        commandListEntity.options[
                            Math.floor(
                                Math.random() * commandListEntity.options.length
                            )
                        ];

                    await logUsage.interaction(interaction);

                    await interaction.editReply(randomText);
                } catch (e) {
                    logger.error(e);
                    await interaction.editReply(
                        "Miauw! Er is een fout opgetreden!"
                    );
                }
            },
        };

        registerCommand(command);
    }

    // Register commands
    const rest = new REST({ version: "9" }).setToken(Config.getBotToken());

    // Globally register commands
    await rest.put(Routes.applicationCommands(Config.getApplicationId()), {
        body: [],
    });

    logger.verbose("Adding commands to guilds...");

    // Register commands to guilds.
    for (const guild of client.guilds.cache.values()) {
        if (
            Config.getBotMode() === BotMode.DEVELOPMENT &&
            process.env.DEV_GUILD_ID !== guild.id
        )
            continue;
        logger.verbose("Adding commands to guild: " + guild.name);
        await rest.put(
            Routes.applicationGuildCommands(
                Config.getApplicationId(),
                guild.id
            ),
            {
                body: restCommandArray,
            }
        );
    }

    logger.debug("Added commands to guilds.");

    logger.verbose("Adding command permissions...");

    if (!client.application?.owner) await client.application?.fetch();

    const permissions: ApplicationCommandPermissionData[] = [
        {
            id: "487283576325275648",
            type: "USER",
            permission: true,
        },
    ];

    if (Config.getBotMode() === BotMode.PRODUCTION) {
        permissions.push({
            id: "904060845955379260",
            type: "ROLE",
            permission: true,
        });
    }

    for (const guild of client.guilds.cache.values()) {
        logger.verbose("Adding command permissions to guild: " + guild.name);

        const fullPermissions: GuildApplicationCommandPermissionData[] = [];
        const commands = await guild.commands.fetch();

        for (const command of commands.values()) {
            logger.verbose("Adding permission to command: " + command.name);

            fullPermissions.push({
                id: command.id,
                permissions,
            });
        }

        await guild.commands.permissions.set({ fullPermissions });
    }

    logger.debug("Added command permissions.");
};

export default {
    handle,
    registerCommand,
    registerCommands,
};
