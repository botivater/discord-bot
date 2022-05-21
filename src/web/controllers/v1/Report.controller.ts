import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { ReportService } from "../../services/v1/report.service";


export class ReportController {
    private reportService: ReportService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.reportService = container.resolve('reportService');
    }

    public async getAllReports(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.reportService.getAllReports()
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async getReport(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.reportService.getReport({
                        id: Number(id)
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async updateReport(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { resolved } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.reportService.updateReport(
                        {
                            id: Number(id)
                        },
                        {
                            resolved
                        }
                    )
                )
            );
        } catch (e) {
            next(e);
        }
    }
}
