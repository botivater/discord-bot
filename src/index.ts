import dotenv from "dotenv";
import Discord from "./discord";

export default class FriendshipBubbleDiscordBot {
    protected discord: Discord;

    constructor () {
        dotenv.config();

        this.discord = Discord.getInstance();
    }
}

export const friendshipBubbleDiscordBot = new FriendshipBubbleDiscordBot();
