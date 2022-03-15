import logger from "@/logger";
import { VoiceState } from "discord.js";
import activityHelper from "../helpers/activityHelper";

const handle = async (oldState: VoiceState, newState: VoiceState) => {
    const { guild, id } = newState;

    if (!guild || !id) {
        return;
    }

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
