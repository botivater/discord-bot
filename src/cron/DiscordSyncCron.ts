import logger from "@/logger";
import { DiscordSyncService } from "@/service/DiscordSyncService";
import { CronJob } from "cron";
import Discord from "discord.js";

export class DiscordSyncCron {
    private discordClient: Discord.Client;
    private discordSyncService: DiscordSyncService;
    private cronJob: CronJob;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;
        this.discordSyncService = new DiscordSyncService(this.discordClient);

        this.handleCronJob();

        // Setup background sync cron job.
        this.cronJob = new CronJob("0 * * * * *", this.handleCronJob.bind(this), null, true, "Europe/Brussels");
    }

    private async handleCronJob() {
        // Do a bi-directional compare of the guilds and guild members.
        logger.info("Discord Sync started.");

        await this.discordSyncService.handle();

        logger.info("Discord Sync ended.");
    }
}