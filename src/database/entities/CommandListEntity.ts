import { BaseEntity } from "@/database/entities/BaseEntity";
import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, Unique } from "@mikro-orm/core";
import { GuildEntity } from "./GuildEntity";

@Entity({ tableName: "command_list" })
export class CommandListEntity extends BaseEntity {
    @Property()
    @Unique()
    name!: string;

    @Property()
    description!: string;

    @Property()
    options!: string[];

    @ManyToMany(() => GuildEntity, guildEntity => guildEntity.guildCommandLists)
    guilds = new Collection<GuildEntity>(this);

    constructor(name: string, description: string, options: string[]) {
        super();
        this.name = name;
        this.description = description;
        this.options = options;
    }
}
