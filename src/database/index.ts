import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "@/common/mikro-orm.config";

class Database {
    public async getORM() {
        const orm = await MikroORM.init(mikroOrmConfig);
        return orm;
    }
}

export default new Database();
