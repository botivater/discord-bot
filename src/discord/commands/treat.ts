import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { logger } from "../../logger";
import constants from "../../../constants.json";
import { checkRole } from "../../common";
import Config from "../../common/config";

export default {
    command: new SlashCommandBuilder()
        .setName("snoepje")
        .setDescription("Geef Mira een snoepje!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            const randomText =
                constants.treat.texts[
                    Math.floor(Math.random() * constants.treat.texts.length)
                ];

            await interaction.reply({ content: randomText });
        } catch (e) {
            logger.error(e);
            await interaction.reply(
                "Miauw! Er is een fout opgetreden! Je moet een kat ook niet een hele server laten runnen..."
            );
        }
    },
};
