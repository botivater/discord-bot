import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { logger } from "@/logger";
import { miraRouter } from "./routers/mira";
import { discordRouter } from "./routers/discord";
import { poweredBy } from "./middleware/poweredBy";
import { randomPause } from "./middleware/randomPause";
import Config, { BotMode } from "@/common/config";
import { errorHandler } from "./middleware/errorHandler";
import { routingErrorHandler } from "./middleware/routingErrorHandler";
import { auth } from "express-oauth2-jwt-bearer";

export default class Web {
    protected static instance: Web | null = null;

    protected app: express.Express;

    protected server: http.Server;

    constructor(port = 3000) {
        logger.info("Web server is starting up...");
        this.app = express();

        this.app.use(poweredBy);

        if (Config.getBotMode() === BotMode.DEVELOPMENT) {
            this.app.use(randomPause);
        }

        this.app.use(cors());

        
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.use(
            auth({
                audience: Config.getAPIAuth0Audience(),
                issuerBaseURL: `https://${Config.getAPIAuth0Domain()}`,
            })
        );

        this.setupRoutes();

        this.app.use(routingErrorHandler);
        this.app.use(errorHandler);

        this.server = http.createServer(this.app);
        this.server.listen(port, "0.0.0.0", () => {
            logger.info("Web server is ready.");
        });
    }

    protected setupRoutes() {
        this.app.use("/api/discord", discordRouter);
        this.app.use("/api/mira", miraRouter);
    }

    public static getInstance(port = 3000) {
        if (this.instance) return this.instance;
        this.instance = new Web(port);
        return this.instance;
    }
}