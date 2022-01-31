import { OnType } from "@/database/entities/CommandFlowEntity";
import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";
import messageReaction from "./messageReaction";

const handle = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
    messageReaction.handle(reaction, user, OnType.REACTION_REMOVE)
};

export default {
    handle,
};
