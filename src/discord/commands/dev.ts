import { hideLinkEmbed, hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Informatie over de ontwikkelaar van Mira!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const devLink = hyperlink("hier", "https://jonasclaes.be");
        const repoLink = hyperlink("hier", "https://github.com/friendshipbubble/discord-bot");

        await interaction.reply({
            content: `Hey!\nIk ben Mira, en ik ben de kat van Lauri!\n<@487283576325275648> heeft mij speciaal gemaakt voor de Friendship Bubble en onderhoudt mij dagelijks!\nJe kan ${devLink} meer informatie over hem vinden.\nJe kan mijn bits en bytes ${repoLink} vinden!`,
            allowedMentions: {
                parse: []
            }
        });
    }
};
