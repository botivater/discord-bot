import { GuildMemberController } from "../../controllers/v1/GuildMember.controller";
import { Router } from "../Router";


export class GuildMemberRouter extends Router {
    private guildMemberController: GuildMemberController;

    /**
     *
     */
    constructor() {
        super();
        this.guildMemberController = new GuildMemberController();

        this.router.get("/", this.guildMemberController.getAllGuildMembers.bind(this.guildMemberController));
        this.router.get("/:id", this.guildMemberController.getGuildMember.bind(this.guildMemberController));
    }
}