import { PrismaClient } from "@prisma/client";
import database from "../../database";

class ReportService {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = database.getPrisma();   
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

export default new ReportService();
