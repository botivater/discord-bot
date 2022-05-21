import { Router as ExpressRouter } from "express";

export abstract class Router {
    protected router: ExpressRouter;

    /**
     * Construct a new router instance.
     */
    constructor() {
        this.router = ExpressRouter();
    }

    public getRouter(): ExpressRouter {
        return this.router;
    }
}