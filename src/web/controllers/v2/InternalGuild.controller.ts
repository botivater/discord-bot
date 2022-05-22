import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { IGuildService } from "../../services/v2/IGuild.service";
import { IRestController } from "../IRestController";


export class InternalGuildControllerV2 implements IRestController {
    private guildService: IGuildService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.guildService = container.resolve('guildServiceV2');
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
                    await this.guildService.findAll({})
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
                    await this.guildService.findOne({
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
            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            throw new Error("Method not implemented.");
        } catch (e) {
            next(e);
        }
    }
}
