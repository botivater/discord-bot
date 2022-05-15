import database from "../database";
import { GuildEntity } from "../database/entities/GuildEntity";

class GuildEntityRepository {
    public getRepository() {
        return database.getORM().em.fork().getRepository(GuildEntity);
    }
}

export default new GuildEntityRepository();