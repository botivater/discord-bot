import discord from "@/discord";
import Config from "@/common/config";
import logger from "@/logger";
import interactionCreate from "@/discord/events/interactionCreate";
import { inlineCode } from "@discordjs/builders";
import { syncAllUsersInAllGuilds } from "@/discord/sync";
import { Client } from "discord.js";
import { CronJob } from "cron";
import birthday from "../cron/birthday";
import inactiveUsers from "../cron/inactiveUsers";

const handle = async (client: Client) => {
    await interactionCreate.registerCommands(client);

    // Do a first sync on startup.
    syncAllUsersInAllGuilds(client);

    // Background sync for user name changes etc.
    const syncCronJob = new CronJob(
        "0 * * * * *",
        () => {
            const discordClient = discord.getClient();

            syncAllUsersInAllGuilds(discordClient);
        },
        null,
        true,
        "Europe/Brussels"
    );
    syncCronJob.start();

    const birthdayCronJob = new CronJob(
        "0 0 12 * * *",
        birthday.handle,
        null,
        true,
        "Europe/Brussels"
    );
    birthdayCronJob.start();

    const inactiveUsersCronJob = new CronJob(
        "0 */5 * * * *",
        inactiveUsers.handle,
        null,
        true,
        "Europe/Brussels"
    );
    inactiveUsersCronJob.start();

    logger.info("Discord bot is ready.");
};

export default {
    handle,
};
