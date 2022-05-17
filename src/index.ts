require("dotenv").config();
import discord from "./discord";
import web from "./web";
import database from './database';
import { DiscordSyncCron } from "./cron/DiscordSyncCron";
import { DiscordBirthdayCron } from "./cron/DiscordBirthdayCron";

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
        new DiscordBirthdayCron(discordClient);
    }
}

export default new DiscordBot();