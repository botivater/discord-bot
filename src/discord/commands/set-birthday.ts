import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { checkRole } from "../../common";
import Role from "../../common/role";

export default {
  command: <SlashCommandBuilder>new SlashCommandBuilder()
    .setName("verjaardag-instellen")
    .setDescription(
      "Geef je verjaardag door aan Mira voor een leuke melding op je verjaardag!"
    )
    .addStringOption((option) =>
      option
        .setName("verjaardag")
        .setDescription(
          "Jouw verjaardag geschreven als jaar/maand/dag bv. 2001/07/21."
        )
        .setRequired(true)
    ),
  async handle(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    await interaction.deferReply();

    if (checkRole(<GuildMember>interaction.member, [Role.DEVELOPER])) {
      const birthday = interaction.options.getString("verjaardag");
      if (!birthday) {
        await interaction.editReply("Oeps, je hebt geen verjaardag opgegeven.");
        return;
      }

      const parsedBirthday = new Date(birthday);
      if (
        !(parsedBirthday instanceof Date && isFinite(parsedBirthday.getTime()))
      ) {
        await interaction.editReply(
          "Oeps, je hebt een ongeldige verjaardag opgegeven."
        );
        return;
      }

      // TODO: Save date to database

      await interaction.editReply(
        `Jouw verjaardag is op ${parsedBirthday.toLocaleDateString("nl-NL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}!`
      );
    } else {
      await interaction.editReply("Dit commando mag jij niet uitvoeren.");
    }
  },
};
