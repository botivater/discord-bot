import database from "@/database";
import { CommandInvocationEntity } from "@/database/entities/CommandInvocationEntity";
import { EntityManager } from "@mikro-orm/mysql";

type CommandUsageStatistic = {
    commandName: string;
    invocations: number;
}

type CommandUsageStatistics = CommandUsageStatistic[];

class CommandUsageService {
    public async findAll(): Promise<CommandUsageStatistics> {
        const em = <EntityManager> database.getORM().em.fork();

        const queryBuilder = em.createQueryBuilder(CommandInvocationEntity);
        queryBuilder.select(['commandName', 'count(*) as invocations']).groupBy(['commandName']);

        return queryBuilder.execute();
    }
}

export default new CommandUsageService();
