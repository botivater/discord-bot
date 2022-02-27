import database from "@/database";
import { CommandFlowGroupEntity } from "@/database/entities/CommandFlowGroupEntity";
import GuildChannelNotFoundError from "@/errors/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "@/errors/GuildChannelNotTextChannelError";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import discord from "..";
import logUsage from "../helpers/logUsage";

export default {
    command: new SlashCommandBuilder()
        .setName("recreate-flows")
        .setDescription("Recreate reaction flows!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply();

        const em = database.getORM().em.fork();
        const discordClient = discord.getClient();

        const commandFlowGroups = await em.find(
            CommandFlowGroupEntity,
            {},
            {
                orderBy: {
                    id: "asc",
                },
            }
        );

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
            for (const reaction of commandFlowGroup.reactions) {
                await messageSent.react(reaction);
            }

            commandFlowGroup.messageId = messageSent.id;

            em.persist(commandFlowGroup);
        }

        await em.flush();

        await interaction.editReply({
            content: "Done.",
        });
    },
};
