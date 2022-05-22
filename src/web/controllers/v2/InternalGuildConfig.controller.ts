import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IGuildConfigService } from "../../services/v2/IGuildConfig.service";
import { IRestController } from "../IRestController";


export class InternalGuildConfigControllerV2 implements IRestController {
    private guildConfigService: IGuildConfigService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.guildConfigService = container.resolve('guildConfigServiceV2');
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
                    await this.guildConfigService.findAll({})
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
                    await this.guildConfigService.findOne({
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
                    await this.guildConfigService.create(body)
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
                    await this.guildConfigService.update({
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
                    await this.guildConfigService.delete({
                        id: Number(id)
                    })
                )
            )
        } catch (e) {
            next(e);
        }
    }
}
