import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async handle (interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply("Pong!");
    }
};
