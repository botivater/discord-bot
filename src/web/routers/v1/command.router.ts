import { Router } from "express";
import CommandController from "../../controllers/Command.controller";

export const commandRouter = Router();

commandRouter.get("/", CommandController.index);

// Usage
commandRouter.get("/usage", CommandController.getAllUsage);

// Command lists (sentence lists)
commandRouter.get("/lists", CommandController.getAllListCommands);
commandRouter.post("/lists", CommandController.createListCommand);
commandRouter.get("/lists/:id", CommandController.getListCommand);
commandRouter.put("/lists/:id", CommandController.updateListCommand);
commandRouter.delete("/lists/:id", CommandController.deleteListCommand);
