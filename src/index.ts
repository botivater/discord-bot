require("dotenv").config();
import discord from "@/discord";
import web from "@/web";
import database from '@/database';

class FriendshipBubbleDiscordBot {
    constructor() {
        this.setup();
    }

    public async setup() {
        await database.setup();
        await web.setup();
        await discord.setup();
    }
}

export default new FriendshipBubbleDiscordBot();