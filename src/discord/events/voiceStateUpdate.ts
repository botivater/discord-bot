import logger from "../../logger";
import { VoiceState } from "discord.js";
import { container } from "../../configureContainer";


const handle = async (oldState: VoiceState, newState: VoiceState) => {
    const { guild, id } = newState;

    if (!guild || !id) {
        return;
    }

    const activityHelper = container.resolve('activityHelper');

    try {
        await activityHelper.registerActivity({
            guildUid: guild.id,
            guildMemberUid: id,
            timestamp: new Date(),
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
