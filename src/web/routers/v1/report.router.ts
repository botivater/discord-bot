import { Router } from "express";
import ReportController from "../../controllers/v1/Report.controller";

export const reportRouter = Router();

reportRouter.get("/", ReportController.getAllReports);
reportRouter.get("/:id", ReportController.getReport);
reportRouter.put("/:id", ReportController.updateReport);
