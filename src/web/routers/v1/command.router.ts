
import { CommandController } from "../../controllers/v1/Command.controller";
import { Router } from "../Router";


export class CommandRouter extends Router {
    private commandController: CommandController;

    /**
     *
     */
    constructor() {
        super();
        this.commandController = new CommandController();

        this.router.get("/", this.commandController.index.bind(this.commandController));

        // Usage
        this.router.get("/usage", this.commandController.getAllUsage.bind(this.commandController));

        // Command lists (sentence lists)
        this.router.get("/lists", this.commandController.getAllListCommands.bind(this.commandController));
        this.router.post("/lists", this.commandController.createListCommand.bind(this.commandController));
        this.router.get("/lists/:id", this.commandController.getListCommand.bind(this.commandController));
        this.router.put("/lists/:id", this.commandController.updateListCommand.bind(this.commandController));
        this.router.delete("/lists/:id", this.commandController.deleteListCommand.bind(this.commandController));
    }
}