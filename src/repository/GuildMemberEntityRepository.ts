import database from "../database";
import { GuildMemberEntity } from "../database/entities/GuildMemberEntity";

class GuildMemberEntityRepository {
    public getRepository() {
        return database.getORM().em.fork().getRepository(GuildMemberEntity);
    }
}

export default new GuildMemberEntityRepository();