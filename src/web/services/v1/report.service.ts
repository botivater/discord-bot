import { PrismaClient } from "@prisma/client";

export class ReportService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getAllReports() {
        return this.prisma.report.findMany();
    }

    public async getReport(data: { id: number }) {
        const { id } = data;

        return this.prisma.report.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        });
    }

    public async updateReport(
        find: {
            id: number;
        },
        data: { resolved: boolean }
    ) {
        const { id } = find;
        const { resolved } = data;

        const dbReport = await this.prisma.report.update({
            where: {
                id: id
            },
            data: {
                resolved
            }
        });
        if (!dbReport) throw new Error("Not found error");

        return dbReport;
    }
}
