require("dotenv").config();
import { Discord } from "./discord";
import { Web } from "./web";
import { DiscordSyncCron } from "./cron/DiscordSyncCron";
import { DiscordBirthdayCron } from "./cron/DiscordBirthdayCron";
import database from "./database";

class DiscordBot {
    private discord: Discord;
    private web: Web;

    constructor() {
        this.discord = new Discord();
        this.discord.on("ready", this.onDiscordReadyHandler.bind(this));

        this.web = new Web();

        this.setup();
    }

    private async setup() {
        await this.discord.setup();
        await this.web.setup();
    }

    private async onDiscordReadyHandler() {
        new DiscordSyncCron(this.discord, database.getPrisma());
        new DiscordBirthdayCron(this.discord, database.getPrisma());
    }
    
    public getDiscord(): Discord {
        return this.discord;
    }

    public getWeb(): Web {
        return this.web;
    }
}

export const discordBot = new DiscordBot();
