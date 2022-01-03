import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import {
    Configuration,
    Connection,
    IDatabaseDriver,
    Options,
} from "@mikro-orm/core";
import Config from "./config";

const mikroOrmConfig:
    | Configuration<IDatabaseDriver<Connection>>
    | Options<IDatabaseDriver<Connection>> = {
    entities: [GuildEntity, GuildMemberEntity],
    dbName: "discord-bot",
    type: "mysql",
    clientUrl: Config.getDatabaseURL(),
};

export default mikroOrmConfig;
