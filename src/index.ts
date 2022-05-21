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
    private static instance: DiscordBot;
    private discord: Discord;
    private web: Web;

    constructor() {
        this.discord = container.resolve('discord');
        this.discord.on("ready", this.onDiscordReadyHandler.bind(this));

        this.web = new Web();

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

    public getWeb(): Web {
        return this.web;
    }

    public static getInstance(): DiscordBot {
        if (!DiscordBot.instance) DiscordBot.instance = new DiscordBot();
        return DiscordBot.instance;
    }
}

const discordBot = new DiscordBot();
