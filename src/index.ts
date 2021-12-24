require("dotenv").config();
import Discord from "./discord";
import Web from "./web";

export default class FriendshipBubbleDiscordBot {
  protected static discord: Discord;
  protected static web: Web;

  public static setup() {
    this.discord = Discord.getInstance();
    this.web = Web.getInstance();
  }

  public static getDiscord() {
    return this.discord;
  }

  public static getWeb() {
    return this.web;
  }
}

FriendshipBubbleDiscordBot.setup();
