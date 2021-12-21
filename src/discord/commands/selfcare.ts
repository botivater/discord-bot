import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import constants from "../../../constants.json";

export default {
    command: new SlashCommandBuilder()
        .setName("selfcare")
        .setDescription("Laat Mira een self care tip geven!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const selfcareTips = constants.selfcare.tips;
        const randomTip = selfcareTips[Math.floor(Math.random() * selfcareTips.length)];

        interaction.deferReply();
        setTimeout(() => {
            interaction.editReply({
                content: `Mira's tip:\n${randomTip}`
            });
        }, 2000);
    }
};
