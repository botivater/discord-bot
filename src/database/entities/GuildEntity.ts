import { BaseEntity } from "@/database/entities/BaseEntity";
import {
    Collection,
    Entity,
    OneToMany,
    Property,
    Unique,
} from "@mikro-orm/core";
import { GuildMemberEntity } from "./GuildMemberEntity";

@Entity({ tableName: "guild" })
export class GuildEntity extends BaseEntity {
    @Property({ length: 64, nullable: false })
    @Unique()
    uid!: string;

    @Property({ nullable: true })
    name?: string;

    @OneToMany(() => GuildMemberEntity, (guildMember) => guildMember.guild)
    guildMembers = new Collection<GuildMemberEntity>(this);

    constructor(uid: string, name?: string) {
        super();
        this.uid = uid;
        this.name = name;
    }
}
