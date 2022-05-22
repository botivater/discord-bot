import { Router } from "./Router";
import express from "express";

// Routers
import { InternalGuildRouterV2 } from "./v2/InternalGuild.router";
import { InternalGuildConfigRouterV2 } from "./v2/InternalGuildConfig.router";
import { InternalGuildMemberRouterV2 } from "./v2/InternalGuildMember.router";
import { InternalWelcomeMessageConfigRouterV2 } from "./v2/InternalWelcomeMessageConfig.router";


export class V2Router extends Router {
    private apiTokenMiddleware: express.Handler;
    private apiAuthMiddleware: express.Handler;

    private internalGuildRouter: Router;
    private internalGuildMemberRouter: Router;
    private internalGuildConfigRouter: Router;
    private internalWelcomeMessageConfigRouter: Router;

    /**
     *
     */
    constructor(apiTokenMiddleware: express.Handler, apiAuthMiddleware: express.Handler) {
        super();
        this.apiTokenMiddleware = apiTokenMiddleware;
        this.apiAuthMiddleware = apiAuthMiddleware;

        this.internalGuildRouter = new InternalGuildRouterV2();
        this.internalGuildMemberRouter = new InternalGuildMemberRouterV2();
        this.internalGuildConfigRouter = new InternalGuildConfigRouterV2();
        this.internalWelcomeMessageConfigRouter = new InternalWelcomeMessageConfigRouterV2();

        this.router.use("/internal/guild", this.apiTokenMiddleware, this.internalGuildRouter.getRouter());
        this.router.use("/internal/guildMember", this.apiTokenMiddleware, this.internalGuildMemberRouter.getRouter());
        this.router.use("/internal/guildConfig", this.apiTokenMiddleware, this.internalGuildConfigRouter.getRouter());
        this.router.use("/internal/welcomeMessageConfig", this.apiTokenMiddleware, this.internalWelcomeMessageConfigRouter.getRouter());
    }
}