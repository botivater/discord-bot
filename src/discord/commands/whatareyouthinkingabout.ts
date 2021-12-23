import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";

export default {
  command: new SlashCommandBuilder()
    .setName("waardenkjeaan")
    .setDescription("Laat Mira haar gedachten voorlezen!"),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    try {
      const randomText =
        constants.whatareyouthinkingabout.texts[
          Math.floor(
            Math.random() * constants.whatareyouthinkingabout.texts.length
          )
        ];

      await interaction.reply({ content: randomText });
    } catch (e) {
      logger.error(e);
      await interaction.reply("Miauw! Er is een fout opgetreden!");
    }
  },
};
