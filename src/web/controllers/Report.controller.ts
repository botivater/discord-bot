import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import reportService from "../services/report.service";

class ReportController {
    public async getAllReports(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await reportService.getAllReports()
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
                    await reportService.getReport({
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
                    await reportService.updateReport(
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

export default new ReportController();
