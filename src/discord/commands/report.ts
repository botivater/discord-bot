import GuildChannelNotFoundError from "../../web/error/GuildChannelNotFoundError";
import {
    channelMention,
    roleMention,
    SlashCommandBuilder,
    userMention,
} from "@discordjs/builders";
import { Interaction } from "discord.js";
import logUsage from "../helpers/logUsage";
import database from "../../database";

export default {
    command: <SlashCommandBuilder>new SlashCommandBuilder()
        .setName("report")
        .setDescription(
            "Meld ongewenst gedrag of iemand die zich niet aan de regels houdt."
        )
        .setDefaultPermission(true)
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

            if (!interaction.guild) {
                throw new Error("Guild not found in interaction!");
            }

            const prisma = database.getPrisma();

            const dbGuildMemberSender = await prisma.guildMember.findFirst({
                where: {
                    AND: [
                        {
                            guild: {
                                snowflake: {
                                    equals: interaction.guildId || ""
                                }
                            }
                        },
                        {
                            snowflake: {
                                equals: interaction.user.id
                            }
                        }
                    ]
                }
            })
            if (!dbGuildMemberSender) {
                throw new Error(
                    "Ik kan jou niet terugvinden, contacteer een developer."
                );
            }

            let dbGuildMemberReported = undefined;

            if (user) {
                dbGuildMemberReported = await prisma.guildMember.findFirst({
                    where: {
                        AND: [
                            {
                                guild: {
                                    snowflake: {
                                        equals: interaction.guildId || ""
                                    }
                                }
                            },
                            {
                                snowflake: {
                                    equals: user.id
                                }
                            }
                        ]
                    }
                })
                if (!dbGuildMemberReported) {
                    throw new Error(
                        "Ik kan de persoon die je wil rapporteren niet terugvinden, contacteer een developer."
                    );
                }
            }

            await prisma.report.create({
                data: {
                    guildMemberId: dbGuildMemberSender.id,
                    channelId: interaction.channelId,
                    description: description || undefined,
                    reportedGuildMemberId: dbGuildMemberReported?.id,
                    anonymous: anonymous === null ? undefined : anonymous
                }
            });

            await logUsage.interaction(interaction);

            await interaction.guild.channels.fetch()
            let systemChannel = interaction.guild.channels.cache.find(channel => channel.name == "systeem");
            if (!systemChannel) {
                systemChannel = await interaction.guild.channels.create("systeem", {
                    type: "GUILD_TEXT"
                });
            }

            if (!systemChannel || !systemChannel.isText()) {
                throw new GuildChannelNotFoundError("Guild #systeem channel not found!");
            }

            let message = `**Er is een nieuwe report binnen gekomen!**`;
            message += `\n${roleMention("803363614673076305")}`;
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
                    roles: ["803363614673076305"],
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
