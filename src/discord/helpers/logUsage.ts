import database from "@/database";
import { CommandInvocationEntity } from "@/database/entities/CommandInvocationEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { Interaction } from "discord.js";

class LogUsage {
    public async interaction(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const orm = database.getORM();
        const dbGuild = await orm.em.findOne(GuildEntity, {
            uid: interaction.guild?.id,
        });
        const dbGuildMember = await orm.em.findOne(GuildMemberEntity, {
            $and: [{ uid: interaction.member.user.id }, { guild: dbGuild }],
        });
        const commandInvocation = new CommandInvocationEntity(
            interaction.commandName,
            dbGuild || undefined,
            dbGuildMember || undefined
        );
        orm.em.persist(commandInvocation);
        await orm.em.flush();
    }
}

export default new LogUsage();
