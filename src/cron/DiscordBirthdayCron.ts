import logger from "../logger";
import { CronJob } from "cron";
import Discord from "discord.js";
import { DiscordBirthdayService } from "src/service/DiscordBirthdayService";

export class DiscordBirthdayCron {
    private discordClient: Discord.Client;
    private discordBirthdayService: DiscordBirthdayService;
    private cronJob: CronJob;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;
        this.discordBirthdayService = new DiscordBirthdayService(this.discordClient);

        // Setup background sync cron job.
        this.cronJob = new CronJob("0 0 12 * * *", this.handleCronJob.bind(this), null, true, "Europe/Brussels");
    }

    private async handleCronJob() {
        // Do a bi-directional compare of the guilds and guild members.
        logger.info("Discord Birthday Cron started.");

        await this.discordBirthdayService.handle();

        logger.info("Discord Birthday Cron ended.");
    }
}