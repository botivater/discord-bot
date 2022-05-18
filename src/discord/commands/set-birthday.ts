import { SlashCommandBuilder } from "@discordjs/builders";
import { CronJob } from "cron";
import { GuildMember, Interaction } from "discord.js";
import database from "../../database";
import logUsage from "../helpers/logUsage";

export default {
    command: <SlashCommandBuilder>new SlashCommandBuilder()
        .setName("verjaardag-instellen")
        .setDescription(
            "Geef je verjaardag door aan Mira voor een leuke melding op je verjaardag!"
        )
        .setDefaultPermission(true)
        .addStringOption((option) =>
            option
                .setName("verjaardag")
                .setDescription(
                    "Jouw verjaardag geschreven als jaar-maand-dag bv. 2001-07-21. Een / gebruiken werkt NIET."
                )
                .setRequired(true)
        ),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: true });

        try {
            const birthday = interaction.options.getString("verjaardag");
            if (!birthday) {
                throw new Error("Je hebt geen verjaardag opgegeven.");
            }

            const parsedBirthday = new Date(birthday);
            if (
                !(
                    parsedBirthday instanceof Date &&
                    isFinite(parsedBirthday.getTime())
                )
            ) {
                throw new Error("Je hebt een ongeldige verjaardag opgegeven.");
            }

            const prisma = database.getPrisma();

            const dbGuildMember = await prisma.guildMember.findFirst({
                where: {
                    AND: [
                        {
                            guild: {
                                snowflake: interaction.guildId || ""
                            }
                        },
                        {
                            snowflake: interaction.member?.user.id
                        }
                    ]
                }
            });
            if (!dbGuildMember) {
                throw new Error(
                    "Ik kan jou niet terugvinden, contacteer een developer."
                );
            }

            await prisma.guildMember.update({
                where: {
                    id: dbGuildMember.id
                },
                data: {
                    birthday: parsedBirthday
                }
            })

            await logUsage.interaction(interaction);

            await interaction.editReply({
                content: `Ik heb jouw verjaardag opgeslagen. Jouw verjaardag is op ${parsedBirthday.toLocaleDateString(
                    "nl-NL",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }
                )}!`,
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
