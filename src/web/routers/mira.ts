import { Router } from "express";
import FriendshipBubbleDiscordBot from "../..";
import { speak } from "../services/discord";

export const miraRouter = Router();

miraRouter.get("/", async (req, res) => {
  return res.json({ status: "OK" });
});

miraRouter.post("/speak", async (req, res) => {
  try {
    const { channelId, message } = req.body;

    await speak(channelId, message);

    return res.json({
      status: "OK",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.json({
        status: "ERROR",
        error: error.message,
      });
    }

    return res.json({
      status: "ERROR",
      error,
    });
  }
});
