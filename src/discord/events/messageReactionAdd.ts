import discord from "@/discord";
import { logger } from "@/logger";
import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";
import { BuildingBlockType } from "./buildingBlocks/BuildingBlockType";
import emojis from "@/common/emojis";

// Building blocks
import sendMessage, { SendMessageTo } from "./buildingBlocks/sendMessage";
import addRole from "./buildingBlocks/addRole";
import removeRole from "./buildingBlocks/removeRole";
import database from "@/database";
import { CommandFlowEntity } from "@/database/entities/CommandFlowEntity";

type ActionType = {
    buildingBlockType: BuildingBlockType;
    options?: any;
};

const actions: ActionType[] = [
    {
        buildingBlockType: BuildingBlockType.NONE, // 0
    },
    {
        // Sending a message requires extra configuration.
        buildingBlockType: BuildingBlockType.SEND_MESSAGE, // 1
        options: {
            toType: SendMessageTo.USER, // Send to sender
            to: "487283576325275648",
            messageFormat: `{{ pickFirstName guildMember.nickname }} reacted to your message!`,
        },
    },
    {
        buildingBlockType: 2,
        options: {
            roleId: "936251843724599326",
            check: `${emojis.b}${emojis.e}`,
        },
    },
    {
        buildingBlockType: 2,
        options: {
            roleId: "936255651066314752",
            check: `${emojis.n}${emojis.l}`,
        },
    },
];

const handle = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
    try {
        const client = discord.getClient();

        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();
        if (user.partial) await user.fetch();

        if (user.bot) return;

        logger.verbose(`Got reaction with emoji: ${reaction.emoji.name}`);

        // Check if the reaction was in a guild.
        if (!reaction.message.guildId) return;

        // Get the guild this reaction was sent in.
        const guild = client.guilds.cache.get(reaction.message.guildId);
        if (!guild) return;

        // Get the member of the guild that sent this reaction.
        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        logger.verbose("Fetching flow from database.");
        logger.verbose(
            `Query: guid: ${guild.id}, messageId: ${reaction.message.id}`
        );

        // Get the command flow from the database.
        const orm = database.getORM();
        const commandFlows = await orm.em.find(
            CommandFlowEntity,
            {
                $and: [
                    {
                        guild: {
                            uid: guild.id,
                        },
                    },
                    {
                        messageId: reaction.message.id,
                    },
                ],
            },
            {
                orderBy: {
                    order: "asc",
                },
            }
        );

        if (commandFlows.length === 0) return;

        // Handle the list of actions.
        for (const commandFlow of commandFlows) {
            logger.verbose(
                `Handling command flow part ${commandFlow.order} of flow for message ${commandFlow.messageId}.`
            );

            if (commandFlow.buildingBlockType === BuildingBlockType.NONE) {
                // Do nothing;
                continue;
            }

            if (
                commandFlow.buildingBlockType === BuildingBlockType.SEND_MESSAGE
            ) {
                const { toType, to, messageFormat } = JSON.parse(
                    commandFlow.options
                );

                const options = {
                    toType,
                    to,
                    messageFormat,
                    messageParameters: {
                        guild,
                        guildMember,
                        user,
                        reaction,
                    },
                };

                if (options.toType === SendMessageTo.SENDER)
                    options.to = user.id;
                    console.log(`Set to to ${options.to}`)

                console.log(options);

                await sendMessage.handle(options);

                continue;
            }

            if (commandFlow.buildingBlockType === BuildingBlockType.ADD_ROLE) {
                const { roleId, check } = JSON.parse(commandFlow.options);

                await addRole.handle({
                    guildId: guild.id,
                    guildMemberId: guildMember.id,
                    roleId,
                    reaction: reaction.emoji.name || "",
                    check,
                });

                continue;
            }

            if (
                commandFlow.buildingBlockType === BuildingBlockType.REMOVE_ROLE
            ) {
                const { roleId, check } = JSON.parse(commandFlow.options);

                await removeRole.handle({
                    guildId: guild.id,
                    guildMemberId: guildMember.id,
                    roleId,
                    reaction: reaction.emoji.name || "",
                    check,
                });

                continue;
            }
        }
    } catch (err) {
        logger.error(err);
    }
};

export default {
    handle,
};
