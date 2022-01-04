import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "@/common/mikro-orm.config";
import { logger } from "@/logger";

class Database {
    protected orm: MikroORM<IDatabaseDriver<Connection>> | undefined = undefined;

    public async setup() {
        logger.info("Database is starting up...");
        this.orm = await MikroORM.init(mikroOrmConfig);
        logger.info("Database is ready.");
    }

    public getORM() {
        if (!this.orm) throw new Error("ORM is not defined.")
        return this.orm;
    }
}

export default new Database();
