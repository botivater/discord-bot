import { Guild } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import database from "../../../database";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IService } from "../../services/IService";
import { GuildServiceV2 } from "../../services/v2/guild.service";
import { IRestController } from "../IRestController";

class GuildControllerV2 implements IRestController<Guild> {
    private service: IService<Guild>;

    /**
     * @param service Inject a Guild service.
     */
    constructor(service: IService<Guild>) {
        this.service = service;
    }

    public async findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.service.findAll()
                )
            )
        } catch (e) {
            next(e);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.service.findOne({
                        id: Number(id)
                    })
                )
            )
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {  } = req.body;

            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }
}

const guildServiceV2 = new GuildServiceV2(database.getPrisma());
export const guildControllerV2 = new GuildControllerV2(guildServiceV2);
