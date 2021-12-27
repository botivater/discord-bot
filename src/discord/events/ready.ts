import Discord from "..";
import Config, { BotMode } from "@/common/config";
import { logger } from "@/logger";
import interactionCreate from "./interactionCreate";
import { inlineCode } from "@discordjs/builders";
import { syncAllUsersInAllGuilds } from "../sync";
import { Client } from "discord.js";

const handle = async (client: Client) => {
    // This is a workaround to specify that "this" is an instance of Discord.
    await interactionCreate.registerCommands(client);

    const channel = client.channels.cache.get(Config.getSystemChannelId());

    if (channel && channel.isText()) {
        if (Config.getBotMode() === BotMode.DEVELOPMENT) {
            channel.send(
                `Woef! Revision: ${inlineCode(Config.getRevisionId())}`
            );
        } else {
            channel.send(
                `Miauw! Revision: ${inlineCode(Config.getRevisionId())}`
            );
        }
    }

    if (Config.getBotMode() === BotMode.DEVELOPMENT) {
        client.user?.setPresence({
            activities: [{ name: "met Jonas", type: "PLAYING" }],
        });
    } else {
        client.user?.setPresence({
            activities: [{ name: "Lauri", type: "LISTENING" }],
        });
    }

    // Do a first sync on startup.
    syncAllUsersInAllGuilds(client);

    // Background sync for user name changes etc.
    setInterval(() => {
        const discordClient = Discord.getInstance().getClient();

        syncAllUsersInAllGuilds(discordClient);
    }, 60000);

    logger.info("Discord bot is ready.");

    // Setup the collectors
    // These process the reactions to messages like auto-role adds.
    // collectors.setup(this.client);

    // this.client.on("messageReactionAdd", (reaction, user) => {
    //   if (reaction.message.channelId === Config.getSystemChannelId()) {
    //     // console.log(reaction, user);

    //     if (user.bot) return;

    //     const guild = this.client.guilds.cache.get("803327192662671463");
    //     if (!guild) return;

    //     const guildMember = guild.members.cache.get(user.id);
    //     if (!guildMember) return;

    //     let newNickname = guildMember.nickname || "";

    //     const pronouns = PronounChecker.getPronouns(newNickname).join("/");

    //     switch (reaction.emoji.name) {
    //       case "🟦":
    //         if (pronouns) {
    //           newNickname = newNickname.replace(pronouns, "hij/hem");
    //         } else {
    //           newNickname = `${newNickname} hij/hem`;
    //         }
    //         break;

    //       case "🟥":
    //         if (pronouns) {
    //           newNickname = newNickname.replace(pronouns, "zij/haar");
    //         } else {
    //           newNickname = `${newNickname} zij/haar`;
    //         }
    //         break;

    //       case "🟩":
    //         if (pronouns) {
    //           newNickname = newNickname.replace(pronouns, "hen/hun");
    //         } else {
    //           newNickname = `${newNickname} hen/hun`;
    //         }
    //         break;

    //       case "🟨":
    //         if (pronouns) {
    //           newNickname = newNickname.replace(pronouns, "die/diens");
    //         } else {
    //           newNickname = `${newNickname} die/diens`;
    //         }
    //         break;
    //     }

    //     guildMember.setNickname(newNickname);
    //   }
    // });

    // this.client.on("messageReactionRemove", (reaction, user) => {
    //   if (reaction.message.channelId === Config.getSystemChannelId()) {
    //     // console.log(reaction, user);

    //     if (user.bot) return;

    //     const guild = this.client.guilds.cache.get("803327192662671463");
    //     if (!guild) return;

    //     const guildMember = guild.members.cache.get(user.id);
    //     if (!guildMember) return;

    //     let newNickname = guildMember.nickname || "";

    //     const pronouns = PronounChecker.getPronouns(newNickname).join("/");
    //     newNickname = newNickname.replace(pronouns, "unknown");

    //     guildMember.setNickname(newNickname);
    //   }
    // });
};

export default {
    handle,
};
