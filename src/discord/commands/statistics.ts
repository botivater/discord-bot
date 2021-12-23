import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";
import Config from "../../common/config";
import { isMemberDeveloper } from "../../common";

const permissions = [
  {
    id: Config.getDeveloperRoleId(),
    type: "ROLE",
    permission: true,
  },
];

export default {
  command: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Show me dem stats!"),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    try {
      await interaction.deferReply();

      if (isMemberDeveloper(<GuildMember>interaction.member)) {
        setTimeout(async () => {
          await interaction.editReply("Nog niets te zien hier...");
        }, 500);
      } else {
        await interaction.editReply("Dit commando mag jij niet uitvoeren.");
      }
    } catch (e) {
      logger.error(e);
      await interaction.editReply("Miauw! Er is een fout opgetreden!");
    }
  },
};
