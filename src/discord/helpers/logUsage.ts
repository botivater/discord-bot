import database from "@/database";
import { CommandInvocationEntity } from "@/database/entities/CommandInvocationEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { Interaction } from "discord.js";
import logger from "@/logger";

class LogUsage {
    public async interaction(interaction: Interaction) {
        if (!interaction.isCommand()) {
            logger.error(`Interaction is not a command!`);
            return;
        };

        const em = database.getORM().em.fork();

        if (!interaction.guild) {
            logger.error(`Interaction does not contain guild!`);
            return;
        }

        const dbGuild = await em.findOne(GuildEntity, {
            snowflake: interaction.guild?.id,
        });

        if (!dbGuild) {
            logger.error(
                `Could not find guild with id: ${interaction.guild?.id}`
            );
            return;
        }

        const dbGuildMember = await em.findOne(GuildMemberEntity, {
            $and: [{ snowflake: interaction.member?.user.id }, { guild: dbGuild }],
        });

        if (!dbGuildMember) {
            logger.error(
                `Could not find guild member with id: ${interaction.member?.user.id}`
            );
            return;
        }

        const commandInvocation = new CommandInvocationEntity(
            interaction.commandName,
            dbGuild || undefined,
            dbGuildMember || undefined
        );

        em.persist(commandInvocation);

        await em.flush();
    }
}

export default new LogUsage();
