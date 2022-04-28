import {
    channelMention,
    SlashCommandBuilder,
    userMention,
} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logUsage from "../helpers/logUsage";

export enum HelpCommandEnum {
    REPORT = "report",
    VERJAARDAG_INSTELLEN = "verjaardag-instellen",
}

export default {
    command: <SlashCommandBuilder>new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Krijg hulp en info over het gebruiken van een bepaald commando."
        )
        .setDefaultPermission(true)
        .addStringOption((option) =>
            option
                .setName("commando")
                .setDescription("Het commando waar je hulp bij nodig hebt.")
                .setRequired(true)
                .addChoices(
                    { name: "/report", value: HelpCommandEnum.REPORT },
                    {
                        name: "/verjaardag-instellen",
                        value: HelpCommandEnum.VERJAARDAG_INSTELLEN,
                    }
                )
        ),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: true });

        try {
            const command = interaction.options.getString("commando");

            let message = ``;

            switch (command) {
                case HelpCommandEnum.REPORT:
                    message = `Het /report commando kan je gebruiken om iemand van het Mod-team te laten kijken naar een situatie waarin iemand zich niet aan de groepsregels houdt of zich slecht gedraagt.\nHier heb je een video die je laat zien hoe je het gebruikt: https://youtu.be/htYE3np_czE`;
                    break;

                case HelpCommandEnum.VERJAARDAG_INSTELLEN:
                    message = `Het /verjaardag-instellen commando kan je gebruiken om je verjaardag in te stellen. Mira zal je dan op je verjaardag om 12:00 feliciteren!\nHier heb je een video die je laat zien hoe je het gebruikt: https://youtu.be/YX02ePTscaM`;
                    break;
            }

            await logUsage.interaction(interaction);

            await interaction.editReply({
                content: message,
            });
        } catch (e) {
            if (e instanceof Error) {
                await interaction.editReply({
                    content: `Er is een fout opgetreden: ${e.message}`,
                });
            } else {
                await interaction.editReply({
                    content: `Er is een fout opgetreden: ${e}`,
                });
            }
        }
    },
};
