import { IRestController } from "../../controllers/IRestController";
import { InternalGuildMemberControllerV2 } from "../../controllers/v2/InternalGuildMember.controller";
import { Router } from "../Router";


export class InternalGuildMemberRouterV2 extends Router {
    private guildMemberController: IRestController;

    /**
     *
     */
    constructor() {
        super();
        this.guildMemberController = new InternalGuildMemberControllerV2();

        this.router.get("/", this.guildMemberController.findAll.bind(this.guildMemberController));
        this.router.get("/:id", this.guildMemberController.findOne.bind(this.guildMemberController));
        this.router.post("/", this.guildMemberController.create.bind(this.guildMemberController));
        this.router.put("/:id", this.guildMemberController.update.bind(this.guildMemberController));
        this.router.delete("/:id", this.guildMemberController.delete.bind(this.guildMemberController));
    }
}