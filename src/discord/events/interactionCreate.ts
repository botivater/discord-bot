import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";
import {
    ApplicationCommandPermissionData,
    CacheType,
    Client,
    GuildApplicationCommandPermissionData,
    Interaction,
} from "discord.js";
import Config from "../../common/config";
import logger from "../../logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import { container } from "../../configureContainer";

// Commands
import ping from "../commands/ping";
import toneindicator from "../commands/toneindicator";
import dev from "../commands/dev";
import findafriend from "../commands/findafriend";
import setBirthday from "../commands/set-birthday";
import recreateFlows from "../commands/recreate-flows";
import report from "../commands/report";
import help from "../commands/help";

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
    restCommandArray.push(<RESTPostAPIApplicationCommandsJSONBody> command.command.toJSON());
    commandMap[command.command.name] = command.handle;
};

const registerCommands = async (client: Client) => {
    commandMap = {};
    restCommandArray = [];

    registerCommand(ping);
    registerCommand(findafriend);
    registerCommand(toneindicator);
    registerCommand(dev);
    registerCommand(setBirthday);
    // registerCommand(recreateFlows);
    registerCommand(report);
    registerCommand(help);

    // Register database commands
    const prisma = container.resolve('prisma');

    const commandListEntities = await prisma.commandList.findMany();
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
                    if (!commandListEntity.options) {
                        throw new Error("No options found in command list!");
                    }

                    const options: string[] = <string[]> commandListEntity.options;

                    const randomText =
                        options[
                            Math.floor(
                                Math.random() * options.length
                            )
                        ];

                    await container.resolve('logUsage').interaction(interaction);

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

    // TODO: Fix this!
    // logger.verbose("Adding command permissions...");

    // if (!client.application?.owner) await client.application?.fetch();

    // const permissions: ApplicationCommandPermissionData[] = [
    //     {
    //         id: "487283576325275648",
    //         type: "USER",
    //         permission: true,
    //     },
    // ];

    // if (Config.getBotMode() === BotMode.PRODUCTION) {
    //     permissions.push({
    //         id: "904060845955379260",
    //         type: "ROLE",
    //         permission: true,
    //     });
    // }

    // for (const guild of client.guilds.cache.values()) {
    //     logger.verbose("Adding command permissions to guild: " + guild.name);

    //     const fullPermissions: GuildApplicationCommandPermissionData[] = [];
    //     const commands = await guild.commands.fetch();

    //     for (const command of commands.values()) {
    //         logger.verbose("Adding permission to command: " + command.name);

    //         fullPermissions.push({
    //             id: command.id,
    //             permissions,
    //         });
    //     }

    //     await guild.commands.permissions.set({ fullPermissions });
    // }

    // logger.debug("Added command permissions.");
};

export default {
    handle,
    registerCommand,
    registerCommands,
};
