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
import { CommandFlowGroupEntity } from "./CommandFlowGroupEntity";
import { GuildEntity } from "./GuildEntity";
import { GuildMemberEntity } from "./GuildMemberEntity";

/*
 * Command Flow Entity
 * This database entity contains the flow commands
 * for building interactions.
 */
@Entity({ tableName: "command_flow" })
export class CommandFlowEntity extends BaseEntity {
    @ManyToOne(() => CommandFlowGroupEntity)
    commandFlowGroup!: CommandFlowGroupEntity;

    @Enum()
    onType!: OnType;

    @Enum()
    buildingBlockType!: BuildingBlockType;

    @Enum()
    checkType?: CheckType;

    @Property()
    checkValue?: string;

    @Property()
    options!: string;

    @Property()
    order!: number;

    constructor(
        commandFlowGroup: CommandFlowGroupEntity,
        onType: OnType,
        buildingBlockType: BuildingBlockType,
        options: string,
        order: number,
        checkType?: CheckType,
        checkValue?: string
    ) {
        super();
        this.commandFlowGroup = commandFlowGroup;
        this.onType = onType;
        this.buildingBlockType = buildingBlockType;
        this.options = options;
        this.order = order;

        this.checkType = checkType;
        this.checkValue = checkValue;
    }
}

export enum BuildingBlockType {
    NONE = 0,
    SEND_MESSAGE = 1,
    ADD_ROLE = 2,
    REMOVE_ROLE = 3,
}

export enum CheckType {
    NONE,
    REACTION_EMOJI,
}

export enum OnType {
    NONE,
    REACTION_ADD,
    REACTION_REMOVE,
}
