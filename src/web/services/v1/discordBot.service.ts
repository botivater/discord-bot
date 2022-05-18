import discord from "../../../discord";
import interactionCreate from "../../../discord/events/interactionCreate";

class DiscordBotService {
    public async reloadCommands() {
        const discordClient = discord.getClient();
        await interactionCreate.registerCommands(discordClient);
    }
}

export default new DiscordBotService();
