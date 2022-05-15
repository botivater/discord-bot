import { GuildEntity } from "../database/entities/GuildEntity";
import logger from "../logger";
import GuildEntityRepository from "../repository/GuildEntityRepository";
import { DiscordPronounService } from "../service/DiscordPronounService";
import { DiscordSyncService } from "../service/DiscordSyncService";
import { DiscordSystemMessageChannel } from "../service/DiscordSystemMessageChannel";
import { IMessageChannel } from "../service/IMessageChannel";
import { CronJob } from "cron";
import Discord from "discord.js";

export class DiscordSyncCron {
    private discordClient: Discord.Client;
    private discordSyncService: DiscordSyncService;
    private guildEntityRepository;
    private cronJob: CronJob;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;
        this.discordSyncService = new DiscordSyncService(this.discordClient);
        this.guildEntityRepository = GuildEntityRepository.getRepository();

        this.handleCronJob();

        // Setup background sync cron job.
        this.cronJob = new CronJob("0 * * * * *", this.handleCronJob.bind(this), null, true, "Europe/Brussels");
    }

    private async handleCronJob() {
        // Do a bi-directional compare of the guilds and guild members.
        logger.info("Discord Sync started.");

        await this.discordSyncService.handle();

        const databaseGuilds = await this.guildEntityRepository.findAll({ populate: ['guildMembers'] });
        await Promise.all(databaseGuilds.map(databaseGuild => this.handlePronounService(databaseGuild)));

        logger.info("Discord Sync ended.");
    }

    private async handlePronounService(databaseGuild: GuildEntity): Promise<void> {
        const messageChannel: IMessageChannel = new DiscordSystemMessageChannel(this.discordClient, databaseGuild);
        const discordPronounService = new DiscordPronounService(this.discordClient, messageChannel);
        await discordPronounService.handle(databaseGuild);
    }
}