import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { container } from "../../configureContainer";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Laat Mira 'Pong!' zeggen!")
        .setDefaultPermission(true),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply("Pong!");

        await container.resolve('logUsage').interaction(interaction);
    },
};
