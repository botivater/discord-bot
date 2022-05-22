import PronounChecker from "../common/pronounChecker";
import logger from "../logger";
import { bold, userMention } from "@discordjs/builders";
import Discord from "discord.js";
import { IMessageChannel } from "./IMessageChannel";
import { Guild, PrismaClient } from "@prisma/client";

export class DiscordPronounService {
    private discordClient: Discord.Client;
    private prisma: PrismaClient;
    private messageChannel: IMessageChannel;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     * @param messageChannel Inject an instance of a message channel.
     */
    constructor(discordClient: Discord.Client, prisma: PrismaClient, messageChannel: IMessageChannel) {
        this.discordClient = discordClient;
        this.prisma = prisma;
        this.messageChannel = messageChannel;
    }

    public async handle(databaseGuild: Guild): Promise<void> {
        const databaseGuildMembers = await this.prisma.guildMember.findMany({
            where: {
                guild: {
                    id: databaseGuild.id
                }
            }
        });

        await this.discordClient.guilds.fetch(databaseGuild.snowflake);

        const discordGuild = this.discordClient.guilds.cache.get(databaseGuild.snowflake);
        if (!discordGuild) throw new Error("Discord guild not found!");

        await discordGuild.members.fetch();

        for await (const databaseGuildMember of databaseGuildMembers) {
            const discordGuildMember = discordGuild.members.cache.get(databaseGuildMember.snowflake);
            if (!discordGuildMember) throw new Error("Discord guild member not found!");

            if (databaseGuildMember.name !== discordGuildMember.displayName) {
                // Check if the username or the nickname contain valid pronouns.
                const hasValidPronouns = PronounChecker.checkString(discordGuildMember.displayName);

                let message = ``;
                message += `Iemands naam is veranderd.\n`;
                message += `Gebruiker: ${userMention(databaseGuildMember.snowflake)} (${databaseGuildMember.identifier}).\n`;
                message += `Oude naam: ${databaseGuildMember.name}.\n`;
                message += `Nieuwe naam: ${discordGuildMember.displayName}.\n`;
                message += `Pronouns zijn ${bold(hasValidPronouns ? 'in orde.' : 'niet in orde!')}`;

                try {
                    await this.messageChannel.send(message);
                } catch (e) {
                    logger.error(e);
                }

                await this.prisma.guildMember.update({
                    where: {
                        id: databaseGuildMember.id
                    },
                    data: {
                        name: discordGuildMember.displayName
                    }
                });
            }
        }
    }
}