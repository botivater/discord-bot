// https://aws.random.cat/meow
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { logger } from "../../logger";

export default {
    command: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Laat Mira een kat ophalen en tonen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            await interaction.deferReply();


            setTimeout(async () => {
                const randomNumber = Math.floor(Math.random() * 57);

                await interaction.editReply({ files: [`https://static.friendshipbubble.nl/mira/cats/${randomNumber}.jpg`] });
            }, 1000);
        } catch (e) {
            logger.error(e);
            await interaction.editReply("Miauw! Er is een fout opgetreden!");
        }
    }
};
