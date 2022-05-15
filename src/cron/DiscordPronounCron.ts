import logger from "@/logger";
import GuildEntityRepository from "@/repository/GuildEntityRepository";
import { DiscordPronounService } from "@/service/DiscordPronounService";
import { DiscordSystemMessageChannel } from "@/service/DiscordSystemMessageChannel";
import { IMessageChannel } from "@/service/IMessageChannel";
import { CronJob } from "cron";
import Discord from "discord.js";

export class DiscordPronounCron {
    private discordClient: Discord.Client;
    private cronJob: CronJob;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     */
    constructor(discordClient: Discord.Client) {
        this.discordClient = discordClient;

        this.handleCronJob();

        // Setup background sync cron job.
        this.cronJob = new CronJob("0 * * * * *", this.handleCronJob.bind(this), null, true, "Europe/Brussels");
    }

    private async handleCronJob() {
        // Do a bi-directional compare of the guilds and guild members.
        logger.info("Discord Pronoun Check started.");

        const databaseGuilds = await GuildEntityRepository.getRepository().findAll({ populate: ['guildMembers'] });
        for (const databaseGuild of databaseGuilds) {
            const messageChannel: IMessageChannel = new DiscordSystemMessageChannel(this.discordClient, databaseGuild);
            const discordPronounService = new DiscordPronounService(this.discordClient, messageChannel);
            await discordPronounService.handle(databaseGuild);
        }

        logger.info("Discord Pronoun Check ended.");
    }
}