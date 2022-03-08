import { CommandFlowEntity } from "@/database/entities/CommandFlowEntity";
import { CommandFlowGroupEntity } from "@/database/entities/CommandFlowGroupEntity";
import { CommandInvocationEntity } from "@/database/entities/CommandInvocationEntity";
import { CommandListEntity } from "@/database/entities/CommandListEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { ReportEntity } from "@/database/entities/ReportEntity";
import {
    Configuration,
    Connection,
    IDatabaseDriver,
    MemoryCacheAdapter,
    Options,
} from "@mikro-orm/core";
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import Config from "./config";

const mikroOrmConfig:
    | Configuration<IDatabaseDriver<Connection>>
    | Options<IDatabaseDriver<Connection>> = {
    entities: [GuildEntity, GuildMemberEntity, CommandListEntity, CommandInvocationEntity, CommandFlowGroupEntity, CommandFlowEntity, ReportEntity],
    metadataProvider: TsMorphMetadataProvider,
    dbName: Config.getDatabaseName(),
    type: "mysql",
    clientUrl: Config.getDatabaseURL(),
};

export default mikroOrmConfig;
