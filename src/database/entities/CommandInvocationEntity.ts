import { BaseEntity } from "@/database/entities/BaseEntity";
import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, Unique } from "@mikro-orm/core";
import { GuildEntity } from "./GuildEntity";
import { GuildMemberEntity } from "./GuildMemberEntity";

/*
 * Command Invocation Entity
 * This database entity keeps track of the usage of each command.
 * Every invocation is 1 row.
 * We want to keep track of the guild, user and command name.
 */
@Entity({ tableName: "command_invocation" })
export class CommandInvocationEntity extends BaseEntity {
    @ManyToOne()
    guild?: GuildEntity;

    @ManyToOne()
    guildMember?: GuildMemberEntity;

    @Property()
    commandName!: string;

    constructor(commandName: string, guild?: GuildEntity, guildMember?: GuildMemberEntity) {
        super();
        this.commandName = commandName;
        this.guild = guild;
        this.guildMember = guildMember;
    }
}
