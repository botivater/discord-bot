import Config from "@/common/config";
import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { ReportEntity } from "@/database/entities/ReportEntity";
import GuildChannelNotFoundError from "@/errors/GuildChannelNotFoundError";
import {
    channelMention,
    SlashCommandBuilder,
    userMention,
} from "@discordjs/builders";
import { Interaction } from "discord.js";
import discord from "..";
import logUsage from "../helpers/logUsage";

export default {
    command: <SlashCommandBuilder>new SlashCommandBuilder()
        .setName("report")
        .setDescription(
            "Meld ongewenst gedrag of iemand die zich niet aan de regels houdt."
        )
        .setDefaultPermission(false)
        .addStringOption((option) =>
            option
                .setName("omschrijving")
                .setDescription(
                    "Hier kan je een omschrijving van het probleem invullen."
                )
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("gebruiker")
                .setDescription(
                    "Hier kan je een gebruiker kiezen die in strijd is met de regels."
                )
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("anoniem")
                .setDescription(
                    "Wil je je identiteit meegeven aan het Mod team? Vul dan 'False' in."
                )
                .setRequired(false)
        ),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: true });

        try {
            const description = interaction.options.getString("omschrijving");
            const user = interaction.options.getUser("gebruiker");
            const anonymous = interaction.options.getBoolean("anoniem");

            const em = database.getORM().em.fork();

            const dbGuildMemberSender = await em.findOne(GuildMemberEntity, {
                $and: [
                    {
                        guild: {
                            uid: interaction.guildId,
                        },
                    },
                    {
                        uid: interaction.user.id,
                    },
                ],
            });
            if (!dbGuildMemberSender) {
                throw new Error(
                    "Ik kan jou niet terugvinden, contacteer een developer."
                );
            }

            let dbGuildMemberReported = undefined;

            if (user) {
                dbGuildMemberReported = await em.findOne(GuildMemberEntity, {
                    $and: [
                        {
                            guild: {
                                uid: interaction.guildId,
                            },
                        },
                        {
                            uid: user.id,
                        },
                    ],
                });
                if (!dbGuildMemberReported) {
                    throw new Error(
                        "Ik kan de persoon die je wil rapporteren niet terugvinden, contacteer een developer."
                    );
                }
            }

            const report = new ReportEntity(
                dbGuildMemberSender,
                interaction.channelId,
                description || undefined,
                dbGuildMemberReported,
                anonymous === null ? undefined : anonymous
            );

            em.persist(report);
            await em.flush();

            await logUsage.interaction(interaction);

            const discordClient = discord.getClient();
            const systemChannel = discordClient.channels.cache.get(
                Config.getSystemChannelId()
            );
            if (!systemChannel || !systemChannel.isText()) {
                throw new GuildChannelNotFoundError(
                    Config.getSystemChannelId()
                );
            }

            let message = `**Er is een nieuwe report binnen gekomen.**`;
            message += `\nKanaal: ${channelMention(interaction.channelId)}`;

            if (anonymous === false) {
                message += `\nRapporteur: ${userMention(interaction.user.id)}`;
            }

            if (description) {
                message += `\nOmschrijving: ${description}`;
            }

            if (user) {
                message += `\nGebruiker in fout: ${userMention(user.id)}`;
            }

            await systemChannel.send({
                content: message,
                allowedMentions: {
                    parse: [],
                },
            });

            await interaction.editReply({
                content: `Bedankt voor jouw report, ik heb het Mod-team ingelicht! Alleen jij kan dit bericht zien.`,
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
