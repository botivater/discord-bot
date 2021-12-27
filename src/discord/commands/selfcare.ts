import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import constants from "../../../constants.json";
import { logger } from "../../logger";

export default {
    command: new SlashCommandBuilder()
        .setName("selfcare")
        .setDescription("Laat Mira een self care tip geven!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            const selfcareTips = constants.selfcare.tips;
            const randomTip =
                selfcareTips[Math.floor(Math.random() * selfcareTips.length)];

            await interaction.reply({
                content: `Mira's tip:\n${randomTip}`,
            });
        } catch (e) {
            logger.error(e);
            await interaction.reply("Miauw! Er is een fout opgetreden!");
        }
    },
};
