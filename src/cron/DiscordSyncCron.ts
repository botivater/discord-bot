import logger from "../logger";
import { DiscordPronounService } from "../service/DiscordPronounService";
import { DiscordSyncService } from "../service/DiscordSyncService";
import { DiscordSystemMessageChannel } from "../service/DiscordSystemMessageChannel";
import { IMessageChannel } from "../service/IMessageChannel";
import { CronJob } from "cron";
import Discord from "discord.js";
import { Guild, PrismaClient } from "@prisma/client";

export class DiscordSyncCron {
    private discordClient: Discord.Client;
    private prisma: PrismaClient;
    private discordSyncService: DiscordSyncService;
    private cronJob: CronJob;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client, prisma: PrismaClient) {
        this.discordClient = discordClient;
        this.prisma = prisma;
        this.discordSyncService = new DiscordSyncService(this.discordClient, this.prisma);

        this.handleCronJob();

        // Setup background sync cron job.
        this.cronJob = new CronJob("0 * * * * *", this.handleCronJob.bind(this), null, true, "Europe/Brussels");
    }

    private async handleCronJob() {
        // Do a bi-directional compare of the guilds and guild members.
        logger.info("Discord Sync started.");

        await this.discordSyncService.handle();

        const databaseGuilds = await this.prisma.guild.findMany({
            include: {
                guildMembers: true
            }
        });
        await Promise.all(databaseGuilds.map(databaseGuild => this.handlePronounService(databaseGuild)));

        logger.info("Discord Sync ended.");
    }

    private async handlePronounService(databaseGuild: Guild): Promise<void> {
        const messageChannel: IMessageChannel = new DiscordSystemMessageChannel(this.discordClient, databaseGuild);
        const discordPronounService = new DiscordPronounService(this.discordClient, this.prisma, messageChannel);
        await discordPronounService.handle(databaseGuild);
    }
}