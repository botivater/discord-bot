require("dotenv").config();
import discord from "./discord";
import web from "./web";
import { DiscordSyncCron } from "./cron/DiscordSyncCron";
import { DiscordBirthdayCron } from "./cron/DiscordBirthdayCron";
import database from "./database";

class DiscordBot {
    constructor() {
        this.setup();
    }

    private async setup() {
        await web.setup();
        await discord.setup();
        
        discord.getClient().on("ready", this.onDiscordReadyHandler.bind(this));
    }

    private async onDiscordReadyHandler() {
        const discordClient = discord.getClient();

        new DiscordSyncCron(discordClient, database.getPrisma());
        new DiscordBirthdayCron(discordClient, database.getPrisma());
    }
}

export const discordBot = new DiscordBot();
