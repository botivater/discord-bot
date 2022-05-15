import PronounChecker from "@/common/pronounChecker";
import { GuildEntity } from "@/database/entities/GuildEntity";
import logger from "@/logger";
import GuildMemberEntityRepository from "@/repository/GuildMemberEntityRepository";
import { bold, userMention } from "@discordjs/builders";
import Discord from "discord.js";
import { IMessageChannel } from "./IMessageChannel";

export class DiscordPronounService {
    private discordClient: Discord.Client;
    private messageChannel: IMessageChannel;
    private guildMemberEntityRepository;

    /**
     * @param discordClient Inject an instance of Discord.JS.
     * @param messageChannel Inject an instance of a message channel.
     */
    constructor(discordClient: Discord.Client, messageChannel: IMessageChannel) {
        this.discordClient = discordClient;
        this.messageChannel = messageChannel;
        this.guildMemberEntityRepository = GuildMemberEntityRepository.getRepository();
    }

    public async handle(databaseGuild: GuildEntity): Promise<void> {
        const databaseGuildMembers = await this.guildMemberEntityRepository.find({
            guild: databaseGuild
        });

        for await (const databaseGuildMember of databaseGuildMembers) {
            await this.discordClient.guilds.fetch(databaseGuild.snowflake);

            const discordGuild = this.discordClient.guilds.cache.get(databaseGuild.snowflake);
            if (!discordGuild) throw new Error("Discord guild not found!");

            await discordGuild.members.fetch();

            const discordGuildMember = discordGuild.members.cache.get(databaseGuildMember.snowflake);
            if (!discordGuildMember) throw new Error("Discord guild member not found!");

            const nickname = discordGuildMember.nickname || discordGuildMember.user.username || "";

            if (databaseGuildMember.name !== nickname) {
                // Check if the username or the nickname contain valid pronouns.
                const hasValidPronouns = PronounChecker.checkString(nickname);

                let message = ``;
                message += `Iemands naam is veranderd.\n`;
                message += `Gebruiker: ${userMention(databaseGuildMember.snowflake)} (${databaseGuildMember.identifier}).\n`;
                message += `Oude naam: ${databaseGuildMember.name}.\n`;
                message += `Nieuwe naam: ${nickname}.\n`;
                message += `Pronouns zijn ${bold(hasValidPronouns ? 'in orde.' : 'niet in orde!')}`;

                try {
                    await this.messageChannel.send(message);
                } catch (e) {
                    logger.error(e);
                }

                databaseGuildMember.name = nickname;
                await this.guildMemberEntityRepository.persistAndFlush(databaseGuildMember);
            }
        }
    }
}