import { BaseEntity } from "@/database/entities/BaseEntity";
import {
    Collection,
    Entity,
    Enum,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Property,
    Unique,
} from "@mikro-orm/core";
import { GuildEntity } from "./GuildEntity";
import { GuildMemberEntity } from "./GuildMemberEntity";

/*
 * Command Flow Entity
 * This database entity contains the flow commands
 * for building interactions.
 */
@Entity({ tableName: "command_flow" })
export class CommandFlowEntity extends BaseEntity {
    @ManyToOne()
    guild!: GuildEntity;

    @Property()
    messageId!: string;

    @Property()
    buildingBlockType!: number;

    @Property()
    options!: string;

    @Property()
    order!: number;

    constructor(
        guild: GuildEntity,
        messageId: string,
        buildingBlockType: number,
        options: string,
        order: number,
    ) {
        super();
        this.guild = guild;
        this.messageId = messageId;
        this.buildingBlockType = buildingBlockType;
        this.options = options;
        this.order = order;
    }
}
