import { Router } from "express";
import CommandController from "../controllers/Command.controller";

export const commandRouter = Router();

commandRouter.get("/", CommandController.index);
commandRouter.get("/lists", CommandController.getAllListCommands);
commandRouter.post("/lists", CommandController.createListCommand);
commandRouter.post("/lists/attach", CommandController.attachListCommand);
commandRouter.post("/lists/detach", CommandController.detachListCommand);
commandRouter.get("/lists/:id", CommandController.getListCommand);
commandRouter.put("/lists/:id", CommandController.updateListCommand);
commandRouter.delete("/lists/:id", CommandController.deleteListCommand);
