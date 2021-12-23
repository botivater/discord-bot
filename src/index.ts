require("dotenv").config();
import Discord from "./discord";

export default class FriendshipBubbleDiscordBot {
  protected discord: Discord;

  constructor() {
    this.discord = Discord.getInstance();
  }
}

export const friendshipBubbleDiscordBot = new FriendshipBubbleDiscordBot();
