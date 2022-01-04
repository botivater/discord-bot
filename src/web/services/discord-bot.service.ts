import discord from "@/discord";
import interactionCreate from "@/discord/events/interactionCreate";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

class DiscordBotService {
    protected em: EntityManager<IDatabaseDriver<Connection>> | undefined =
        undefined;

    public async reloadCommands() {
        const discordClient = discord.getClient();
        await interactionCreate.registerCommands(discordClient);
    }
}

export default new DiscordBotService();
