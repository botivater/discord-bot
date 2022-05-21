import logger from "../../logger";
import { Message, PartialMessage } from "discord.js";
import { container } from "../../configureContainer";


const handle = async (message: Message | PartialMessage) => {
    if (message.partial) await message.fetch();

    const { author, guildId, createdTimestamp } = message;

    if (!author || !guildId) {
        return;
    }

    if (author.bot) return;

    try {
        await container.resolve('activityHelper').registerActivity({
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
