import http from "http";
import express, { NextFunction, Request, Response } from "express";
import logger from "@/logger";
import Config, { BotMode } from "@/common/config";
import database from "@/database";
import { RequestContext } from "@mikro-orm/core";

// Middleware
import bodyParser from "body-parser";
import cors from "cors";
import { poweredBy } from "./middleware/poweredBy";
import { randomPause } from "./middleware/randomPause";
import { errorHandler } from "./middleware/errorHandler";
import { routingErrorHandler } from "./middleware/routingErrorHandler";
import { auth } from "express-oauth2-jwt-bearer";

// Routers
import { miraRouter } from "./routers/mira";
import { discordRouter } from "./routers/discord.router";
import { commandRouter } from "./routers/command.router";
import { discordBotRouter } from "./routers/discordBot.router";

class Web {
    protected app: express.Express | undefined = undefined;

    protected server: http.Server | undefined = undefined;

    protected authMiddleware: express.Handler | undefined = undefined;

    public async setup() {
        logger.info("Web server is starting up...");

        this.app = express();

        // Middleware
        this.authMiddleware = auth({
            audience: Config.getAPIAuth0Audience(),
            issuerBaseURL: `https://${Config.getAPIAuth0Domain()}`,
        });

        this.app.use(poweredBy);

        if (Config.getBotMode() === BotMode.DEVELOPMENT && Config.getRandomPauseMiddlewareEnabled()) {
            this.app.use(randomPause);
        }

        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (database.orm) {
                RequestContext.create(database.orm.em, next);
            }
        });

        // Routers
        this.setupRoutes();

        // Error middleware
        this.app.use(routingErrorHandler);
        this.app.use(errorHandler);

        // HTTP server
        this.server = http.createServer(this.app);
        await new Promise<void>((resolve) => {
            if (!this.server) throw new Error("Server is undefined.");
            this.server.listen(Config.getAPIPort(), "0.0.0.0", resolve);
        });
        logger.info("Web server is ready.");
        logger.info(`REST API is available on http://localhost:${Config.getAPIPort()}`);
    }

    protected setupRoutes() {
        if (!this.app) throw new Error("App is undefined.");
        if (!this.authMiddleware)
            throw new Error("Auth middleware is undefined.");

        // Routers
        this.app.use("/api/discord", this.authMiddleware, discordRouter);
        this.app.use("/api/mira", this.authMiddleware, miraRouter);
        this.app.use("/api/command", this.authMiddleware, commandRouter);
        this.app.use("/api/discord-bot", this.authMiddleware, discordBotRouter);
    }
}

export default new Web();
