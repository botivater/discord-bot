import { Router } from "express";
import MiraController from "../../controllers/v1/Mira.controller";

export const miraRouter = Router();

miraRouter.get("/", MiraController.index);
miraRouter.post("/speak", MiraController.speak);
