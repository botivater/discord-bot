import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Laat Mira 'Pong!' zeggen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply("Pong!");
    }
};
