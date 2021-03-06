import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import logger from "../../logger";
import { container } from "../../configureContainer";
const constants = {
    "findafriend": {
        "amount": 358,
        "texts": [
          "Ik kwam vandaag deze knapperd tegen!",
          "Ik zag zojuist dit beestje op Tinder. Zal ik links of rechts swipen?",
          "Zojuist was dit vriendje op bezoek.",
          "Dit is een foto van een van mijn beste vrienden.",
          "Heb je ooit een knapper huisdier dan deze gezien? Okay na mij dan, want ik ben natuurlijk de aller knapste!",
          "The cuteness, it's too much... I'm in love!",
          "Vorige week had ik een date met deze hotstuff!",
          "Dit is een van mijn vriendjes!",
          "Ik kwam laatst dit vriendje tegen, maar we zijn vergeten telefoonnummers uit te wisselen. Weten jullie wie het baasje is zodat we een playdate kunnen organiseren?",
          "Hier is een van mijn beste vrienden!",
          "Zojuist zag ik deze knapperd rondlopen! Was te verlegen om hallo te zeggen tho...",
          "Wie dit is? Mijn BFF natuurlijk!",
          "#vrienden #gezellig #bff #squadgoals"
        ]
      }
}

export default {
    command: new SlashCommandBuilder()
        .setName("vindeenvriendje")
        .setDescription("Laat Mira een vriendje tonen!")
        .setDefaultPermission(true),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        try {
            const randomNumber = Math.floor(
                Math.random() * constants.findafriend.amount
            );
            const randomText =
                constants.findafriend.texts[
                    Math.floor(
                        Math.random() * constants.findafriend.texts.length
                    )
                ];

            await interaction.editReply({
                content: randomText,
                files: [
                    `https://static.friendshipbubble.nl/mira/pets/${randomNumber}.jpg`,
                ],
            });

            await container.resolve('logUsage').interaction(interaction);
        } catch (e) {
            logger.error(e);
            await interaction.editReply("Miauw! Er is een fout opgetreden!");
        }
    },
};
