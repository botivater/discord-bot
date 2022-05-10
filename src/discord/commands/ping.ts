import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import logUsage from "../helpers/logUsage";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Laat Mira 'Pong!' zeggen!")
        .setDefaultPermission(true),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply("Pong!");

        await logUsage.interaction(interaction);
    },
};
