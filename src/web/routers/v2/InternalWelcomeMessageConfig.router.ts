import { IRestController } from "../../controllers/IRestController";
import { InternalWelcomeMessageConfigControllerV2 } from "../../controllers/v2/InternalWelcomeMessageConfig.controller";
import { Router } from "../Router";


export class InternalWelcomeMessageConfigRouterV2 extends Router {
    private welcomeMessageConfigController: IRestController;

    /**
     *
     */
    constructor() {
        super();
        this.welcomeMessageConfigController = new InternalWelcomeMessageConfigControllerV2();

        this.router.get("/", this.welcomeMessageConfigController.findAll.bind(this.welcomeMessageConfigController));
        this.router.get("/:id", this.welcomeMessageConfigController.findOne.bind(this.welcomeMessageConfigController));
        this.router.post("/", this.welcomeMessageConfigController.create.bind(this.welcomeMessageConfigController));
        this.router.put("/:id", this.welcomeMessageConfigController.update.bind(this.welcomeMessageConfigController));
        this.router.delete("/:id", this.welcomeMessageConfigController.delete.bind(this.welcomeMessageConfigController));
    }
}