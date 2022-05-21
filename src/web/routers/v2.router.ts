import { Router } from "./Router";

// Routers
import { guildRouter } from "./v2/guild.router";
import { guildConfigRouter } from "./v2/guildConfig.router";
import { guildMemberRouter } from "./v2/guildMember.router";
import { welcomeMessageConfigRouter } from "./v2/welcomeMessageConfig.router";


export class V2Router extends Router {
    /**
     *
     */
    constructor() {
        super();

        this.router.use("/guild", guildRouter);
        this.router.use("/guildMember", guildMemberRouter);
        this.router.use("/guildConfig", guildConfigRouter);
        this.router.use("/welcomeMessageConfig", welcomeMessageConfigRouter);
    }
}