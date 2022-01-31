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
import { CommandFlowEntity } from "./CommandFlowEntity";
import { GuildEntity } from "./GuildEntity";

/*
 * Command Flow Entity
 * This database entity contains the flow commands
 * for building interactions.
 */
@Entity({ tableName: "command_flow_group" })
export class CommandFlowGroupEntity extends BaseEntity {
    @ManyToOne()
    guild!: GuildEntity;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @OneToMany(
        () => CommandFlowEntity,
        (commandFlow) => commandFlow.commandFlowGroup
    )
    commandFlows = new Collection<CommandFlowEntity>(this);

    @Enum()
    type!: CommandFlowGroupType;

    @Property()
    messageId!: string;

    @Property()
    channelId!: string;

    @Property()
    messageText!: string;

    @Property()
    reactions!: string[];

    constructor(
        guild: GuildEntity,
        name: string,
        description: string,
        type: CommandFlowGroupType,
        messageId: string,
        channelId: string,
        messageText: string,
        reactions: string[]
    ) {
        super();
        this.guild = guild;
        this.name = name;
        this.description = description;
        this.type = type;
        this.messageId = messageId;
        this.channelId = channelId;
        this.messageText = messageText;
        this.reactions = reactions;
    }
}

export enum CommandFlowGroupType {
    NONE,
    REACTION,
}
