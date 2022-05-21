import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { CommandUsageService } from "../../services/v1/commandUsage.service";
import { CommandListService } from "../../services/v1/commandList.service";
import { container } from "../../../configureContainer";


export class CommandController {
    private commandUsageService: CommandUsageService;
    private commandListService: CommandListService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.commandUsageService = container.resolve('commandUsageService');
        this.commandListService = container.resolve('commandListService');
    }

    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async getAllUsage(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, await this.commandUsageService.findAll()));
        } catch (e) {
            next(e);
        }
    }

    public async getAllListCommands(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.commandListService.findAllListCommands()
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async getListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.commandListService.findListCommand({ id: Number(id) })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async createListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, description, options, guildId } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.commandListService.storeListCommand({ name, description, options, guildId })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async updateListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { name, description, options } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.commandListService.updateListCommand({ id: Number(id) }, { name, description, options })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async deleteListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.commandListService.deleteListCommand({ id: Number(id) })
                )
            );
        } catch (e) {
            next(e);
        }
    }
}
