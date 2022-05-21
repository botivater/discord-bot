import { DiscordBotController } from "../../controllers/v1/DiscordBot.controller";
import { Router } from "../Router";


export class DiscordBotRouter extends Router {
    private discordBotController: DiscordBotController;

    /**
     *
     */
    constructor() {
        super();
        this.discordBotController = new DiscordBotController();

        this.router.get("/", this.discordBotController.index.bind(this.discordBotController));
        this.router.get("/reload/commands", this.discordBotController.reloadCommands.bind(this.discordBotController));
    }
}