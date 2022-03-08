import { BaseEntity } from "@/database/entities/BaseEntity";
import {
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
import { GuildMemberEntity } from "./GuildMemberEntity";

@Entity({ tableName: "report" })
export class ReportEntity extends BaseEntity {
    @ManyToOne()
    guildMember?: GuildMemberEntity;

    @Property()
    channelId?: string;

    @Property({ columnType: 'text' })
    description?: string;

    @ManyToOne()
    user?: GuildMemberEntity;

    @Property()
    anonymous = true;

    @Property()
    resolved = false;

    constructor(
        guildMember?: GuildMemberEntity,
        channelId?: string,
        description?: string,
        user?: GuildMemberEntity,
        anonymous = true,
        resolved = false,
    ) {
        super();
        this.guildMember = guildMember;
        this.channelId = channelId;
        this.description = description;
        this.user = user;
        this.anonymous = anonymous;
        this.resolved = resolved;
    }
}
