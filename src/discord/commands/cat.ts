// https://aws.random.cat/meow
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import logUsage from "../helpers/logUsage";

export default {
    command: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Laat Mira een kat ophalen en tonen!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply(
            "Nieuwe wijsheid van mij:\n/cat is nu /vindeenvriendje! Take a look!\nMiauw out!"
        );

        await logUsage.interaction(interaction);
    },
};
