import { BaseEntity } from "@/database/entities/BaseEntity";
import {
    Cascade,
    Collection,
    DateType,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Property,
    Unique,
} from "@mikro-orm/core";
import { CommandInvocationEntity } from "./CommandInvocationEntity";
import { GuildEntity } from "./GuildEntity";
import { ReportEntity } from "./ReportEntity";

@Entity({ tableName: "guild_member" })
@Unique({ properties: ["snowflake", "guild"] })
export class GuildMemberEntity extends BaseEntity {
    // Should not be unique since a member can belong to 2 guilds, whilst having the same uid.
    @Property({ length: 64 })
    snowflake!: string;

    @Property()
    name?: string;

    @Property()
    identifier?: string;

    @ManyToOne(() => GuildEntity)
    guild!: GuildEntity;

    @OneToMany(
        () => CommandInvocationEntity,
        (commandInvocation) => commandInvocation.guildMember
    )
    commandInvocations = new Collection<CommandInvocationEntity>(this);

    @OneToMany(
        () => ReportEntity,
        (report) => report.guildMember
    )
    reports = new Collection<ReportEntity>(this);

    @Property({ type: DateType, nullable: true })
    birthday?: Date;

    @Property({ nullable: true })
    lastInteraction?: Date;

    @Property({ default: true })
    active = true;

    constructor(snowflake: string, guild: GuildEntity, name?: string, identifier?: string, birthday?: Date, lastInteraction?: Date) {
        super();
        this.snowflake = snowflake;
        this.guild = guild;
        this.name = name;
        this.identifier = identifier;
        this.birthday = birthday;
        this.lastInteraction = lastInteraction;
    }
}
