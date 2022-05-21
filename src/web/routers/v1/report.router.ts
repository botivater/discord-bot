import { Router } from "../Router";
import { ReportController } from "../../controllers/v1/Report.controller";


export class ReportRouter extends Router {
    private reportController: ReportController;

    /**
     *
     */
    constructor() {
        super();
        this.reportController = new ReportController();

        this.router.get("/", this.reportController.getAllReports.bind(this.reportController));
        this.router.get("/:id", this.reportController.getReport.bind(this.reportController));
        this.router.put("/:id", this.reportController.updateReport.bind(this.reportController));
    }
}