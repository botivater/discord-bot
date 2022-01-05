import database from "@/database";
import { CommandInvocationEntity } from "@/database/entities/CommandInvocationEntity";
import { EntityManager } from "@mikro-orm/mysql";

type CommandUsageStatistic = {
    commandName: string;
    invocations: number;
}

type CommandUsageStatistics = CommandUsageStatistic[];

class CommandUsageService {
    protected em: EntityManager | undefined =
        undefined;

    public async findAll(): Promise<CommandUsageStatistics> {
        if (!this.em) this.em = <EntityManager> database.getORM().em;

        const queryBuilder = this.em.createQueryBuilder(CommandInvocationEntity);
        queryBuilder.select(['commandName', 'count(*) as invocations']).groupBy(['commandName']);

        return queryBuilder.execute();
    }
}

export default new CommandUsageService();
