import { Router } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import { speak } from "../services/discord";

export const miraRouter = Router();

miraRouter.get("/", async (req, res) => {
    return res.json({ status: "OK" });
});

miraRouter.post("/speak", async (req, res) => {
    try {
        const { channelId, message } = req.body;

        await speak(channelId, message);

        return res.json(APIResponse.fromData(StatusCode.OK, null));
    } catch (e) {
        const response = APIResponse.fromError(e);
        return res.status(response.statusCode).json(response);
    }
});
