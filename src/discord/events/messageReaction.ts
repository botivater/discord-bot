import discord from "@/discord";
import logger from "@/logger";
import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";
import database from "@/database";
import {
    BuildingBlockType,
    CheckType,
    CommandFlowEntity,
    OnType,
} from "@/database/entities/CommandFlowEntity";

// Building blocks
import sendMessage, { SendMessageTo } from "./buildingBlocks/sendMessage";
import addRole from "./buildingBlocks/addRole";
import removeRole from "./buildingBlocks/removeRole";
import {
    CommandFlowGroupEntity,
    CommandFlowGroupType,
} from "@/database/entities/CommandFlowGroupEntity";
import activityHelper from "../helpers/activityHelper";

const handle = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    onType: OnType = OnType.NONE
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

        try {
            await activityHelper.registerActivity({
                guildUid: reaction.message.guildId,
                guildMemberUid: user.id,
                timestamp: new Date(),
            });
        } catch (e) {
            if (e instanceof Error) {
                logger.error(e);
            } else {
                logger.error(e);
            }
        }

        // Get the guild this reaction was sent in.
        const guild = client.guilds.cache.get(reaction.message.guildId);
        if (!guild) return;

        // Get the member of the guild that sent this reaction.
        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        logger.verbose(
            `Searching database for flows with parameters: \r\nmessageId: ${reaction.message.id}\r\nonType: ${onType}`
        );

        // Get the command flow from the database.
        const em = database.getORM().em.fork();
        const commandFlowGroup = await em.findOne(
            CommandFlowGroupEntity,
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
                    {
                        type: CommandFlowGroupType.REACTION,
                    },
                ],
            },
            {
                orderBy: {
                    commandFlows: {
                        order: "asc",
                    },
                },
                populate: ["commandFlows"],
            }
        );
        if (!commandFlowGroup) return;
        if (commandFlowGroup.commandFlows.length === 0) return;

        // Handle the list of actions.
        for (const commandFlow of commandFlowGroup.commandFlows) {
            logger.verbose(
                `Handling command flow part ${commandFlow.order} of flow for message ${commandFlowGroup.messageId}.`
            );

            if (commandFlow.onType !== onType) continue;

            // Check if the flow should be executed.
            if (commandFlow.checkType !== CheckType.NONE) {
                if (
                    commandFlow.checkType === CheckType.REACTION_EMOJI &&
                    commandFlow.checkValue !== reaction.emoji.name
                )
                    continue;
            }

            logger.verbose(
                `Executing command flow part ${commandFlow.order} of flow for message ${commandFlowGroup.messageId}.`
            );

            // Do nothing.
            if (commandFlow.buildingBlockType === BuildingBlockType.NONE) {
                // Do nothing;
                continue;
            }

            // Send a message.
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

                if (options.toType === SendMessageTo.SENDER) {
                    options.to = user.id;
                }

                await sendMessage.handle(options);

                continue;
            }

            // Add a role
            if (commandFlow.buildingBlockType === BuildingBlockType.ADD_ROLE) {
                const { roleId } = JSON.parse(commandFlow.options);

                await addRole.handle({
                    guildId: guild.id,
                    guildMemberId: guildMember.id,
                    roleId,
                });

                continue;
            }

            // Remove a role
            if (
                commandFlow.buildingBlockType === BuildingBlockType.REMOVE_ROLE
            ) {
                const { roleId } = JSON.parse(commandFlow.options);

                await removeRole.handle({
                    guildId: guild.id,
                    guildMemberId: guildMember.id,
                    roleId,
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
