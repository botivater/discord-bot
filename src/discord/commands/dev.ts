import { hideLinkEmbed, hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export default {
    command: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Informatie over de ontwikkelaar van Mira!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const reply = await interaction.reply({
            content: "Hey!\nIk ben Mira, en ik ben de kat van Lauri!\n<@487283576325275648> heeft mij speciaal gemaakt voor de Friendship Bubble en onderhoudt mij dagelijks!\nJe kan op deze link meer informatie over hem vinden: <https://jonasclaes.be>\nJe kan mijn bits en bytes op deze link vinden: <https://github.com/friendshipbubble/discord-bot>",
            allowedMentions: {
                parse: []
            },
            fetchReply: true
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await reply.react(":smile:");
    }
};
