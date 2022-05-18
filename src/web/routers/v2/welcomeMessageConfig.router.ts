import { Router } from "express";
import { welcomeMessageConfigControllerV2 } from "../../controllers/v2/WelcomeMessageConfig.controller";


export const welcomeMessageConfigRouter = Router();

welcomeMessageConfigRouter.get("/", welcomeMessageConfigControllerV2.findAll.bind(welcomeMessageConfigControllerV2));
welcomeMessageConfigRouter.get("/:id", welcomeMessageConfigControllerV2.findOne.bind(welcomeMessageConfigControllerV2));
welcomeMessageConfigRouter.post("/", welcomeMessageConfigControllerV2.create.bind(welcomeMessageConfigControllerV2));
welcomeMessageConfigRouter.put("/:id", welcomeMessageConfigControllerV2.update.bind(welcomeMessageConfigControllerV2));
welcomeMessageConfigRouter.delete("/:id", welcomeMessageConfigControllerV2.delete.bind(welcomeMessageConfigControllerV2));
