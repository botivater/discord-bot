import { IRestController } from "../../controllers/IRestController";
import { InternalGuildConfigControllerV2 } from "../../controllers/v2/InternalGuildConfig.controller";
import { Router } from "../Router";


export class InternalGuildConfigRouterV2 extends Router {
    private guildConfigController: IRestController;

    /**
     *
     */
    constructor() {
        super();
        this.guildConfigController = new InternalGuildConfigControllerV2();

        this.router.get("/", this.guildConfigController.findAll.bind(this.guildConfigController));
        this.router.get("/:id", this.guildConfigController.findOne.bind(this.guildConfigController));
        this.router.post("/", this.guildConfigController.create.bind(this.guildConfigController));
        this.router.put("/:id", this.guildConfigController.update.bind(this.guildConfigController));
        this.router.delete("/:id", this.guildConfigController.delete.bind(this.guildConfigController));
    }
}