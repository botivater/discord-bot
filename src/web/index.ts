import http from "http";
import express, { NextFunction, Request, Response } from "express";
import logger from "../logger";
import Config from "../common/config";

// Middleware
import bodyParser from "body-parser";
import cors from "cors";
import { poweredBy } from "./middleware/poweredBy";
import { errorHandler } from "./middleware/errorHandler";
import { routingErrorHandler } from "./middleware/routingErrorHandler";
import { auth } from "express-oauth2-jwt-bearer";

// Routers
import { v1Router } from "./routers/v1.router";


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

        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

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
        this.app.use("/api/v1", this.authMiddleware, v1Router);
    }
}

export default new Web();
