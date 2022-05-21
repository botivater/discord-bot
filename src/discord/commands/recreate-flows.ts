import GuildChannelNotFoundError from "../../web/error/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "../../web/error/GuildChannelNotTextChannelError";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { DiscordBot } from "../..";
import { container } from "../../configureContainer";

export default {
    command: new SlashCommandBuilder()
        .setName("recreate-flows")
        .setDescription("Recreate reaction flows!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply();

        const prisma: PrismaClient = container.resolve('prisma');
        const discordClient = container.resolve('discord');

        const commandFlowGroups = await prisma.commandFlowGroup.findMany({
            orderBy: {
                id: "asc"
            }
        });

        for (const commandFlowGroup of commandFlowGroups) {
            const channel = discordClient.channels.cache.get(
                commandFlowGroup.channelId
            );
            if (!channel)
                throw new GuildChannelNotFoundError(commandFlowGroup.channelId);
            if (!channel.isText())
                throw new GuildChannelNotTextChannelError(
                    commandFlowGroup.channelId
                );

            const messageSent = await channel.send(
                commandFlowGroup.messageText
            );
            for (const reaction of JSON.parse(commandFlowGroup.reactions?.toString() || "[]")) {
                await messageSent.react(reaction);
            }
            
            await prisma.commandFlowGroup.update({
                where: {
                    id: commandFlowGroup.id
                },
                data: {
                    messageId: messageSent.id
                }
            })
        }

        await interaction.editReply({
            content: "Done.",
        });
    },
};
