import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CronJob } from "cron";
import { GuildMember, Interaction } from "discord.js";
import discord from "..";
import { checkRole } from "../../common";
import Role from "../../common/role";
import logUsage from "../helpers/logUsage";

export default {
    command: <SlashCommandBuilder>new SlashCommandBuilder()
        .setName("verjaardag-instellen")
        .setDescription(
            "Geef je verjaardag door aan Mira voor een leuke melding op je verjaardag!"
        )
        .setDefaultPermission(false)
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

        await interaction.deferReply({ ephemeral: true });

        try {
            if (!checkRole(<GuildMember>interaction.member, [Role.DEVELOPER])) {
                throw new Error("Dit commando mag jij niet uitvoeren.");
            }

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

            const em = database.getORM().em.fork();
            const dbGuildMember = await em.findOne(GuildMemberEntity, {
                $and: [
                    {
                        guild: {
                            uid: interaction.guildId,
                        },
                    },
                    {
                        uid: interaction.member.user.id,
                    },
                ],
            });
            if (!dbGuildMember) {
                throw new Error(
                    "Ik kan jou niet terugvinden, contacteer een developer."
                );
            }

            dbGuildMember.birthday = parsedBirthday;
            em.persist(dbGuildMember);
            await em.flush();

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
