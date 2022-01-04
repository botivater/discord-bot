import { BaseEntity } from "@/database/entities/BaseEntity";
import {
    Collection,
    Entity,
    ManyToMany,
    OneToMany,
    Property,
    Unique,
} from "@mikro-orm/core";
import { CommandListEntity } from "./CommandListEntity";
import { GuildMemberEntity } from "./GuildMemberEntity";

@Entity({ tableName: "guild" })
export class GuildEntity extends BaseEntity {
    @Property({ length: 64, nullable: false })
    @Unique()
    uid!: string;

    @Property()
    name?: string;

    @OneToMany(() => GuildMemberEntity, (guildMember) => guildMember.guild)
    guildMembers = new Collection<GuildMemberEntity>(this);

    @ManyToMany()
    guildCommandLists = new Collection<CommandListEntity>(this);

    constructor(uid: string, name?: string) {
        super();
        this.uid = uid;
        this.name = name;
    }
}
