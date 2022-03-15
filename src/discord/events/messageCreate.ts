import logger from "@/logger";
import { Message, PartialMessage } from "discord.js";
import activityHelper from "../helpers/activityHelper";

const handle = async (message: Message | PartialMessage) => {
    if (message.partial) await message.fetch();

    const { author, guildId, createdTimestamp } = message;

    if (!author || !guildId) {
        return;
    }

    if (author.bot) return;

    try {
        await activityHelper.registerActivity({
            guildUid: guildId,
            guildMemberUid: author.id,
            timestamp: new Date(createdTimestamp),
        });
    } catch (e) {
        if (e instanceof Error) {
            logger.error(e);
        } else {
            logger.error(e);
        }
    }
};

export default {
    handle,
};
