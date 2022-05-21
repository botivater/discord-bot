import { Discord } from "../../../discord";
import interactionCreate from "../../../discord/events/interactionCreate";

export class DiscordBotService {
    private discord: Discord;

    /**
     * @param discord Inject an instance of Discord.
     */
     constructor(discord: Discord) {
        this.discord = discord;
    }

    public async reloadCommands() {
        await interactionCreate.registerCommands(this.discord);
    }
}
