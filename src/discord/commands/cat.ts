// https://aws.random.cat/meow
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction, MessageAttachment } from "discord.js";
import { logger } from "../../logger";

export default {
    command: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Laat Mira een kat ophalen en tonen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            await interaction.deferReply();

            const attachment = new MessageAttachment("./assets/cats/0.jpg");

            await interaction.editReply({ files: [attachment] });
        } catch (e) {
            logger.error(e);
            interaction.editReply("Miauw! Er is een fout opgetreden!");
        }
    }
};
