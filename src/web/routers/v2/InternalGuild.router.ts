import { IRestController } from "../../controllers/IRestController";
import { InternalGuildControllerV2 } from "../../controllers/v2/InternalGuild.controller";
import { Router } from "../Router";


export class InternalGuildRouterV2 extends Router {
    private guildController: IRestController;

    /**
     *
     */
    constructor() {
        super();
        this.guildController = new InternalGuildControllerV2();

        this.router.get("/", this.guildController.findAll.bind(this.guildController));
        this.router.get("/:id", this.guildController.findOne.bind(this.guildController));
        this.router.post("/", this.guildController.create.bind(this.guildController));
        this.router.put("/:id", this.guildController.update.bind(this.guildController));
        this.router.delete("/:id", this.guildController.delete.bind(this.guildController));
    }
}