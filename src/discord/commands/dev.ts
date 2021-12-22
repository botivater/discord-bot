import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Informatie over de ontwikkelaar van Mira!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply({
            content: "Hey!\nIk ben Mira, en ik ben de kat van Lauri!\n<@487283576325275648> heeft mij speciaal gemaakt voor de Friendship Bubble en onderhoudt mij dagelijks!\nJe kan [hier](https://jonasclaes.be) meer informatie over hem vinden.",
            allowedMentions: {
                parse: []
            }
        });
    }
};
