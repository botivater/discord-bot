import database from "@/database";
import { ReportEntity } from "@/database/entities/ReportEntity";
import { EntityRepository } from "@mikro-orm/mysql";

class ReportService {
    private getReportRepository(): EntityRepository<ReportEntity> {
        return database.getORM().em.fork().getRepository(ReportEntity);
    }

    public async getAllReports() {
        const reportRepository = this.getReportRepository();

        return reportRepository.find(
            {},
        );
    }

    public async getReport(data: { id: number }) {
        const reportRepository = this.getReportRepository();

        const { id } = data;

        return reportRepository.findOne(id);
    }

    public async updateReport(
        find: {
            id: number;
        },
        data: { resolved: boolean }
    ) {
        const reportRepository = this.getReportRepository();

        const { id } = find;
        const { resolved } = data;

        const dbReport = await reportRepository.findOne(id);
        if (!dbReport) throw new Error("Not found error");

        dbReport.resolved = resolved;

        await reportRepository.flush();

        return dbReport;
    }
}

export default new ReportService();
