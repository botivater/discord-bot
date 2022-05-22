import http from "http";
import express from "express";
import logger from "../logger";
import Config from "../common/config";

// Middleware
import bodyParser from "body-parser";
import cors from "cors";
import { poweredBy } from "./middleware/poweredBy";
import { errorHandler } from "./middleware/errorHandler";
import { routingErrorHandler } from "./middleware/routingErrorHandler";

// Routers
import { V1Router } from "./routers/v1.router";
import { V2Router } from "./routers/v2.router";


export class Web {
    private app: express.Express;
    private server: http.Server;
    private apiAuthMiddleware: express.Handler;
    private v1Router: V1Router;
    private v2Router: V2Router;

    /**
     *
     */
    constructor(apiAuthMiddleware: express.Handler, v2Router: V2Router) {
        this.apiAuthMiddleware = apiAuthMiddleware;
        this.v2Router = v2Router;

        logger.info("Web server is starting up...");

        this.app = express();

        // Middleware
        this.app.use(poweredBy);

        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        // Routers
        this.v1Router = new V1Router();
        this.app.use("/api/v1", this.apiAuthMiddleware, this.v1Router.getRouter());
        this.app.use("/api/v2", this.v2Router.getRouter());

        // Error middleware
        this.app.use(routingErrorHandler);
        this.app.use(errorHandler);

        // HTTP server
        this.server = http.createServer(this.app);
    }

    public async setup() {
        await new Promise<void>((resolve) => {
            this.server.listen(Config.getAPIPort(), "0.0.0.0", resolve);
        });
        logger.info("Web server is ready.");
        logger.info(`REST API is available on http://localhost:${Config.getAPIPort()}`);
    }
}
