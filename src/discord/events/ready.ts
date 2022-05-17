import logger from "../../logger";
import interactionCreate from "../../discord/events/interactionCreate";
import { Client } from "discord.js";
import { CronJob } from "cron";
import inactiveUsers from "../cron/inactiveUsers";

const handle = async (client: Client) => {
    await interactionCreate.registerCommands(client);

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
