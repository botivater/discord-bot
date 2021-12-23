import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";

export default {
  command: new SlashCommandBuilder()
    .setName("vindeenvriendje")
    .setDescription("Laat Mira een vriendje tonen!"),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    try {
      const randomNumber = Math.floor(
        Math.random() * constants.findafriend.amount
      );
      const randomText =
        constants.findafriend.texts[
          Math.floor(Math.random() * constants.findafriend.texts.length)
        ];

      await interaction.reply({
        content: randomText,
        files: [
          `https://static.friendshipbubble.nl/mira/pets/${randomNumber}.jpg`,
        ],
      });
    } catch (e) {
      logger.error(e);
      await interaction.reply("Miauw! Er is een fout opgetreden!");
    }
  },
};
