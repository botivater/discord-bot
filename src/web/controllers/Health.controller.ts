import {NextFunction, Request, Response} from "express";
import APIResponse from "../responses/APIResponse";
import {StatusCode} from "../enum/StatusCode";

export class HealthController {


    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {

    }

    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }
}