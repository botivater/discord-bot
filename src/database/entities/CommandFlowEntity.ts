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
    onType!: number;

    @Property()
    buildingBlockType!: number;

    @Property()
    checkType?: number;

    @Property()
    checkValue?: string;

    @Property()
    options!: string;

    @Property()
    order!: number;

    constructor(
        guild: GuildEntity,
        messageId: string,
        onType: number,
        buildingBlockType: number,
        options: string,
        order: number,
        checkType?: number,
        checkValue?: string,
    ) {
        super();
        this.guild = guild;
        this.messageId = messageId;
        this.onType = onType;
        this.buildingBlockType = buildingBlockType;
        this.options = options;
        this.order = order;

        this.checkType = checkType;
        this.checkValue = checkValue;
    }
}
