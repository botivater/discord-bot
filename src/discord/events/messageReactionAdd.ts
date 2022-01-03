import Config from "@/common/config";
import emojis from "@/common/emojis";
import PronounChecker from "@/common/pronounChecker";
import discord from "@/discord";
import { logger } from "@/logger";
import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";

const createPronoun = (oldNickname: string, append: string): string => {
    const oldPronouns = PronounChecker.getPronouns(oldNickname);

    const newPronouns = oldPronouns.filter((elem) => elem !== "unknown");

    newPronouns.push(append);

    const newNickname = oldNickname.replace(
        oldPronouns.join("/"),
        newPronouns.join("/")
    );

    return newNickname;
};

const handle = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
    const client = discord.getClient();

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    logger.verbose(`Got reaction with emoji: ${reaction.emoji.name}`);

    if (reaction.message.channelId === Config.getSystemChannelId()) {
        // console.log(reaction, user);

        if (user.bot) return;

        const guild = client.guilds.cache.get("803327192662671463");
        if (!guild) return;

        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        logger.info(`Changing pronouns of ${guildMember.nickname}`);

        let newNickname = guildMember.nickname || "";

        const pronouns = PronounChecker.getPronouns(newNickname);

        switch (reaction.emoji.name) {
            case emojis[1]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "hij");
                } else {
                    newNickname = `${newNickname} hij`;
                }
                break;

            case emojis[2]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "hem");
                } else {
                    newNickname = `${newNickname} hem`;
                }
                break;

            case emojis[3]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "zij");
                } else {
                    newNickname = `${newNickname} zij`;
                }
                break;

            case emojis[4]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "haar");
                } else {
                    newNickname = `${newNickname} haar`;
                }
                break;

            case emojis[5]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "hen");
                } else {
                    newNickname = `${newNickname} hen`;
                }
                break;

            case emojis[6]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "hun");
                } else {
                    newNickname = `${newNickname} hun`;
                }
                break;

            case emojis[7]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "die");
                } else {
                    newNickname = `${newNickname} die`;
                }
                break;

            case emojis[8]:
                if (pronouns.length > 0) {
                    newNickname = createPronoun(newNickname, "diens");
                } else {
                    newNickname = `${newNickname} diens`;
                }
                break;
        }

        try {
            guildMember.setNickname(newNickname);
        } catch (e) {
            logger.error(e);
        }

        logger.info(
            `Changed pronouns of ${guildMember.nickname} to ${newNickname}`
        );
    }
};

export default {
    handle,
};
