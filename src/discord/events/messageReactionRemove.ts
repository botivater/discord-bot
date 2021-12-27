import Config from "@/common/config";
import emojis from "@/common/emojis";
import PronounChecker from "@/common/pronounChecker";
import FriendshipBubbleDiscordBot from "@/index";
import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";

const handle = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
    const discord = FriendshipBubbleDiscordBot.getDiscord();
    const client = discord.getClient();

    // if (reaction.partial) await reaction.fetch();
    // if (user.partial) await user.fetch();

    if (reaction.message.channelId === Config.getSystemChannelId()) {
        // console.log(reaction, user);

        if (user.bot) return;

        const guild = client.guilds.cache.get("803327192662671463");
        if (!guild) return;

        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        let newNickname = guildMember.nickname || "";

        const pronouns = PronounChecker.getPronouns(newNickname).join("/");

        let newPronouns = PronounChecker.getPronouns(newNickname);

        switch (reaction.emoji.name) {
            case emojis[1]:
                newPronouns = newPronouns.filter((elem) => elem !== "hij");
                break;

            case emojis[2]:
                newPronouns = newPronouns.filter((elem) => elem !== "hem");
                break;

            case emojis[3]:
                newPronouns = newPronouns.filter((elem) => elem !== "zij");
                break;

            case emojis[4]:
                newPronouns = newPronouns.filter((elem) => elem !== "haar");
                break;

            case emojis[5]:
                newPronouns = newPronouns.filter((elem) => elem !== "hen");
                break;

            case emojis[6]:
                newPronouns = newPronouns.filter((elem) => elem !== "hun");
                break;

            case emojis[7]:
                newPronouns = newPronouns.filter((elem) => elem !== "die");
                break;

            case emojis[8]:
                newPronouns = newPronouns.filter((elem) => elem !== "diens");
                break;
        }

        if (newPronouns.length > 0) {
            newNickname = newNickname.replace(pronouns, newPronouns.join("/"));
        } else {
            newNickname = newNickname.replace(pronouns, "unknown");
        }

        guildMember.setNickname(newNickname);
    }
};

export default {
    handle,
};
