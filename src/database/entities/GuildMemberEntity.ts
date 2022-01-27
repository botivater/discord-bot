import { BaseEntity } from "@/database/entities/BaseEntity";
import {
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Property,
    Unique,
} from "@mikro-orm/core";
import { CommandInvocationEntity } from "./CommandInvocationEntity";
import { GuildEntity } from "./GuildEntity";

@Entity({ tableName: "guild_member" })
@Unique({ properties: ['uid', 'guild'] })
export class GuildMemberEntity extends BaseEntity {
    // Should not be unique since a member can belong to 2 guilds, whilst having the same uid.
    @Property({ length: 64 })
    uid!: string;

    @Property()
    name?: string;

    @ManyToOne(() => GuildEntity)
    guild!: GuildEntity;

    @OneToMany(() => CommandInvocationEntity, commandInvocation => commandInvocation.guildMember)
    commandInvocations = new Collection<CommandInvocationEntity>(this);

    constructor(uid: string, guild: GuildEntity, name?: string) {
        super();
        this.uid = uid;
        this.guild = guild;
        this.name = name;
    }
}
