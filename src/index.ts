require("dotenv").config();
import discord from "@/discord";
import web from "@/web";
import database from '@/database';
import { DiscordPronounCron } from "./cron/DiscordPronounCron";
import { DiscordSyncCron } from "./cron/DiscordSyncCron";

class DiscordBot {
    constructor() {
        this.setup();
    }

    private async setup() {
        await database.setup();
        await web.setup();
        await discord.setup();
        
        discord.getClient().on("ready", this.onDiscordReadyHandler.bind(this));
    }

    private async onDiscordReadyHandler() {
        const discordClient = discord.getClient();

        new DiscordSyncCron(discordClient);
        new DiscordPronounCron(discordClient);
    }
}

export default new DiscordBot();