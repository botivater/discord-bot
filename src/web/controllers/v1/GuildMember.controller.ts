import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { GuildMemberService } from "../../services/v1/guildMember.service";


export class GuildMemberController {
    private guildMemberService: GuildMemberService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.guildMemberService = container.resolve('guildMemberService');
    }

    public async getAllGuildMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.guildMemberService.getAllGuildMembers()
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async getGuildMember(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.guildMemberService.getGuildMember({
                        id: Number(id)
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }
}
