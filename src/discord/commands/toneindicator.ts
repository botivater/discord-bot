import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("toneindicator")
        .setDescription("Laat Mira de lijst met tone indicators tonen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply({ files: ["https://static.friendshipbubble.nl/mira/other/tone-indicator.jpg"] });
    }
};
