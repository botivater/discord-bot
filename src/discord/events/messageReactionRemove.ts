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

type ActionType = {
    buildingBlockType: BuildingBlockType;
    options?: any;
};

const actions: ActionType[] = [
    // {
    //     buildingBlockType: BuildingBlockType.NONE, // 0
    // },
    // {
    //     // Sending a message requires extra configuration.
    //     buildingBlockType: BuildingBlockType.SEND_MESSAGE, // 1
    //     options: {
    //         toType: SendMessageTo.USER, // Send to sender
    //         to: "487283576325275648",
    //         messageFormat: `{{ pickFirstName guildMember.nickname }} reacted to your message!`,
    //     },
    // },
    {
        buildingBlockType: 3,
        options: {
            roleId: "936251843724599326",
            check: `${emojis.b}${emojis.e}`,
        },
    },
    {
        buildingBlockType: 3,
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
    const client = discord.getClient();

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    if (user.bot) return;
    if (reaction.message.id !== `936231659479650334`) return;

    logger.verbose(`Got reaction with emoji: ${reaction.emoji.name}`);

    // Check if the reaction was in a guild.
    if (!reaction.message.guildId) return;

    // Get the guild this reaction was sent in.
    const guild = client.guilds.cache.get(reaction.message.guildId);
    if (!guild) return;

    // Get the member of the guild that sent this reaction.
    const guildMember = guild.members.cache.get(user.id);
    if (!guildMember) return;

    // Handle the list of actions.
    for (const action of actions) {
        if (action.buildingBlockType === BuildingBlockType.NONE) {
            // Do nothing;
            continue;
        }

        if (action.buildingBlockType === BuildingBlockType.SEND_MESSAGE) {
            if (!action.options) break;

            const { toType, to, messageFormat } = action.options;

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

            if (options.toType === SendMessageTo.SENDER) options.to = user.id;

            await sendMessage.handle(options);

            continue;
        }

        if (action.buildingBlockType === BuildingBlockType.ADD_ROLE) {
            const { roleId, check } = action.options;

                await addRole.handle({
                    guildId: guild.id,
                    guildMemberId: guildMember.id,
                    roleId,
                    reaction: reaction.emoji.name || "",
                    check,
                });

                continue;
        }

        if (action.buildingBlockType === BuildingBlockType.REMOVE_ROLE) {
            const { roleId, check } = action.options;

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
};

export default {
    handle,
};
