import {Router} from "./Router";
import {HealthController} from "../controllers/Health.controller";

export class HealthRouter extends Router {
    private healthController: HealthController;

    /**
     *
     */
    constructor() {
        super();
        this.healthController = new HealthController();

        this.router.get('/', this.healthController.index.bind(this.healthController));
    }

}