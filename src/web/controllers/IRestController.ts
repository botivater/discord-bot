import { Request, Response, NextFunction } from "express";

export interface IRestController<T> {
    findAll(req: Request, res: Response, next: NextFunction): any;
    findOne(req: Request, res: Response, next: NextFunction): any;
    create(req: Request, res: Response, next: NextFunction): any;
    update(req: Request, res: Response, next: NextFunction): any;
    delete(req: Request, res: Response, next: NextFunction): any;
}