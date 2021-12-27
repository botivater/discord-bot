import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";

export default {
    command: new SlashCommandBuilder()
        .setName("affirmatie")
        .setDescription("Laat Mira haar affirmatie geven!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            const randomText =
                constants.affirmation.texts[
                    Math.floor(
                        Math.random() * constants.affirmation.texts.length
                    )
                ];

            await interaction.reply({ content: randomText });
        } catch (e) {
            logger.error(e);
            await interaction.reply("Miauw! Er is een fout opgetreden!");
        }
    },
};
