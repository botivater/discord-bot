import { discordBot } from "../../..";
import { Discord } from "../../../discord";
import interactionCreate from "../../../discord/events/interactionCreate";

class DiscordBotService {
    private discord: Discord;

    /**
     *
     */
    constructor() {
        this.discord = discordBot.getDiscord();
    }

    public async reloadCommands() {
        await interactionCreate.registerCommands(this.discord);
    }
}

export default new DiscordBotService();
