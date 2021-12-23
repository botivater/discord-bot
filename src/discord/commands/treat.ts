import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";
import { checkRole, isMemberDeveloper, roles } from "../../common";

export default {
  command: new SlashCommandBuilder()
    .setName("snoepje")
    .setDescription("Geef Mira een snoepje!"),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    try {
      if (
        checkRole(<GuildMember>interaction.member, [
          roles.DEVELOPER,
          roles.OWNER,
        ])
      ) {
        const randomText =
          constants.treat.texts[
            Math.floor(Math.random() * constants.treat.texts.length)
          ];

        await interaction.reply({ content: randomText });
      } else {
        await interaction.editReply("Dit commando mag jij niet uitvoeren.");
      }
    } catch (e) {
      logger.error(e);
      await interaction.reply("Miauw! Er is een fout opgetreden!");
    }
  },
};
