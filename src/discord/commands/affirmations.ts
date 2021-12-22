import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";

export default {
  command: new SlashCommandBuilder()
    .setName("affirmatie")
    .setDescription("Laat Mira haar affirmatie geven!"),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    try {
      await interaction.deferReply();

      setTimeout(async () => {
        const randomText =
          constants.affirmation.texts[
            Math.floor(Math.random() * constants.affirmation.texts.length)
          ];

        await interaction.editReply({ content: randomText });
      }, 1000);
    } catch (e) {
      logger.error(e);
      await interaction.editReply("Miauw! Er is een fout opgetreden!");
    }
  },
};
