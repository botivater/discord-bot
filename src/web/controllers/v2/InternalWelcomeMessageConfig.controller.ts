import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IWelcomeMessageConfigService } from "../../services/v2/IWelcomeMessageConfig.service";
import { IRestController } from "../IRestController";


export class InternalWelcomeMessageConfigControllerV2 implements IRestController {
    private welcomeMessageConfigService: IWelcomeMessageConfigService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.welcomeMessageConfigService = container.resolve('welcomeMessageConfigServiceV2');
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
                    await this.welcomeMessageConfigService.findAll({})
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
                    await this.welcomeMessageConfigService.findOne({
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
                    await this.welcomeMessageConfigService.create(body)
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
                    await this.welcomeMessageConfigService.update({
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
                    await this.welcomeMessageConfigService.delete({
                        id: Number(id)
                    })
                )
            )
        } catch (e) {
            next(e);
        }
    }
}
