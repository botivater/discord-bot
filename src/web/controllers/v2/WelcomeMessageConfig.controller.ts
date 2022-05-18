import { WelcomeMessageConfig } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import database from "../../../database";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IService } from "../../services/IService";
import { WelcomeMessageConfigServiceV2 } from "../../services/v2/welcomeMessageConfig";
import { IRestController } from "../IRestController";

class WelcomeMessageConfigControllerV2 implements IRestController<WelcomeMessageConfig> {
    private service: IService<WelcomeMessageConfig>;

    /**
     * @param service Inject a GuildConfig service.
     */
    constructor(service: IService<WelcomeMessageConfig>) {
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

const welcomeMessageConfigServiceV2 = new WelcomeMessageConfigServiceV2(database.getPrisma());
export const welcomeMessageConfigControllerV2 = new WelcomeMessageConfigControllerV2(welcomeMessageConfigServiceV2);
