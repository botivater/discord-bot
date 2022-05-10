import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import guildMemberService from "../services/guildMember.service";

class GuildMemberController {
    public async getAllGuildMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await guildMemberService.getAllGuildMembers()
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
                    await guildMemberService.getGuildMember({
                        id: Number(id)
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }
}

export default new GuildMemberController();
