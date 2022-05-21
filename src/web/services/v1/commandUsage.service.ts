import { PrismaClient } from "@prisma/client";

type CommandUsageStatistic = {
    commandName: string;
    invocations: number;
}

type CommandUsageStatistics = CommandUsageStatistic[];

export class CommandUsageService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async findAll(): Promise<CommandUsageStatistics> {
        return await this.prisma.$queryRaw`SELECT commandName, count(*) as invocations FROM CommandInvocation GROUP BY commandName`;
    }
}
