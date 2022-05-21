import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { container } from "../../configureContainer";

export default {
    command: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Informatie over de ontwikkelaar van Mira!")
        .setDefaultPermission(true),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.reply({
            content:
                "Hey!\nIk ben Mira, en ik ben de kat van Lauri!\n<@487283576325275648> heeft mij speciaal gemaakt voor de Friendship Bubble en onderhoudt mij dagelijks!\nJe kan op deze link meer informatie over hem vinden: <https://jonasclaes.be>\nJe kan mijn bits en bytes op deze link vinden: <https://github.com/friendshipbubble/discord-bot>",
            allowedMentions: {
                parse: [],
            },
        });

        await container.resolve('logUsage').interaction(interaction);
    },
};
