import { MiraController } from "../../controllers/v1/Mira.controller";
import { Router } from "../Router";


export class MiraRouter extends Router {
    private miraController: MiraController;

    /**
     *
     */
    constructor() {
        super();
        this.miraController = new MiraController();

        this.router.get("/", this.miraController.index.bind(this.miraController));
        this.router.post("/speak", this.miraController.speak.bind(this.miraController));
    }
}