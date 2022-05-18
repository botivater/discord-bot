import { PrismaClient } from "@prisma/client";
import database from "../../../database";

type CommandUsageStatistic = {
    commandName: string;
    invocations: number;
}

type CommandUsageStatistics = CommandUsageStatistic[];

class CommandUsageService {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = database.getPrisma();
    }

    public async findAll(): Promise<CommandUsageStatistics> {
        return await this.prisma.$queryRaw`SELECT commandName, count(*) as invocations FROM CommandInvocation GROUP BY commandName`;
    }
}

export default new CommandUsageService();
