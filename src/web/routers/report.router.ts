import { Router } from "express";
import ReportController from "../controllers/Report.controller";

export const reportRouter = Router();

reportRouter.get("/", ReportController.getAllReports);
reportRouter.get("/:id", ReportController.getReport);
reportRouter.put("/:id", ReportController.updateReport);
