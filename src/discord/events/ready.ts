import logger from "../../logger";
import interactionCreate from "../../discord/events/interactionCreate";
import { Client } from "discord.js";
import { CronJob } from "cron";
import birthday from "../cron/birthday";
import inactiveUsers from "../cron/inactiveUsers";

const handle = async (client: Client) => {
    await interactionCreate.registerCommands(client);

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
