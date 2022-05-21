import { GuildConfig } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IService } from "../../services/IService";
import { GuildConfigServiceV2 } from "../../services/v2/guildConfig.service";
import { IRestController } from "../IRestController";

class GuildConfigControllerV2 implements IRestController<GuildConfig> {
    private service: IService<GuildConfig>;

    /**
     * @param service Inject a GuildConfig service.
     */
    constructor(service: IService<GuildConfig>) {
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
            const body = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.service.create(body)
                )
            )
        } catch (e) {
            next(e);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const body = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.service.update({
                        id: Number(id)
                    }, body)
                )
            )
        } catch (e) {
            next(e);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.service.delete({
                        id: Number(id)
                    })
                )
            )
        } catch (e) {
            next(e);
        }
    }
}

export const guildConfigControllerV2 = new GuildConfigControllerV2(container.resolve('guildConfigServiceV2'));
