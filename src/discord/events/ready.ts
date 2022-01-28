import discord from "@/discord";
import Config, { BotMode } from "@/common/config";
import { logger } from "@/logger";
import interactionCreate from "@/discord/events/interactionCreate";
import { inlineCode } from "@discordjs/builders";
import { syncAllUsersInAllGuilds } from "@/discord/sync";
import { Client } from "discord.js";
import collectors from "../collectors";

const handle = async (client: Client) => {
    // This is a workaround to specify that "this" is an instance of Discord.
    // TODO: Re-enable this (disabled to developer faster)
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
        const discordClient = discord.getClient();

        syncAllUsersInAllGuilds(discordClient);
    }, 60000);

    // TODO: APIify this
    // collectors.setup(client);

    logger.info("Discord bot is ready.");
};

export default {
    handle,
};
