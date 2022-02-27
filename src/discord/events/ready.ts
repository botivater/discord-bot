import discord from "@/discord";
import Config, { BotMode } from "@/common/config";
import logger from "@/logger";
import interactionCreate from "@/discord/events/interactionCreate";
import { inlineCode } from "@discordjs/builders";
import { syncAllUsersInAllGuilds } from "@/discord/sync";
import { Client } from "discord.js";
import { CronJob } from "cron";
import birthday from "../cron/birthday";

const handle = async (client: Client) => {
    if (
        Config.getBotMode() !== BotMode.DEVELOPMENT ||
        (Config.getBotMode() === BotMode.DEVELOPMENT &&
            Config.commandsEnabled())
    ) {
        await interactionCreate.registerCommands(client);
    }

    const channel = client.channels.cache.get(Config.getSystemChannelId());

    if (channel && channel.isText()) {
        if (Config.getBotMode() !== BotMode.DEVELOPMENT) {
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
    const syncCronJob = new CronJob('0 * * * * *', () => {
        const discordClient = discord.getClient();

        syncAllUsersInAllGuilds(discordClient);
    }, null, true, 'Europe/Brussels');
    syncCronJob.start();

    const birthdayCronJob = new CronJob('0 0 12 * * *', birthday.handle, null, true, 'Europe/Brussels');
    birthdayCronJob.start();

    logger.info("Discord bot is ready.");
};

export default {
    handle,
};
