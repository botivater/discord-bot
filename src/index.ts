require("dotenv").config();
import { Discord } from "./discord";
import { Web } from "./web/index";
import { DiscordSyncCron } from "./cron/DiscordSyncCron";
import { DiscordBirthdayCron } from "./cron/DiscordBirthdayCron";
import { container } from "./configureContainer";
import { CronJob } from "cron";
import inactiveUsers from "./discord/cron/inactiveUsers";
import logger from "./logger";

export class DiscordBot {
    private discord: Discord;
    private web: Web;

    constructor(discord: Discord, web: Web) {
        this.discord = discord;
        this.web = web;

        this.discord.on("ready", this.onDiscordReadyHandler.bind(this));

        this.setup();
    }

    private async setup() {
        await this.discord.setup();
        await this.web.setup();
    }

    private async onDiscordReadyHandler() {
        const inactiveUsersCronJob = new CronJob(
            "0 */5 * * * *",
            inactiveUsers.handle,
            null,
            true,
            "Europe/Brussels"
        );
        inactiveUsersCronJob.start();

        new DiscordSyncCron();
        new DiscordBirthdayCron();

        logger.info("Discord bot is ready.");
    }
}

const discordBot = container.build(DiscordBot);
