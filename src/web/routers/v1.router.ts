import { Router } from "./Router";
import { DiscordRouter } from "./v1/discord.router";
import { MiraRouter } from "./v1/mira";
import { CommandRouter } from "./v1/command.router";
import { DiscordBotRouter } from "./v1/discordBot.router";
import { ReportRouter } from "./v1/report.router";
import { GuildMemberRouter } from "./v1/guildMember.router";


export class V1Router extends Router {
    private discordRouter: Router;
    private miraRouter: Router;
    private commandRouter: Router;
    private discordBotRouter: Router;
    private reportRouter: Router;
    private guildMemberRouter: Router;

    /**
     *
     */
    constructor() {
        super();

        this.discordRouter = new DiscordRouter();
        this.miraRouter = new MiraRouter();
        this.commandRouter = new CommandRouter();
        this.discordBotRouter = new DiscordBotRouter();
        this.reportRouter = new ReportRouter();
        this.guildMemberRouter = new GuildMemberRouter();

        this.router.use("/discord", this.discordRouter.getRouter());
        this.router.use("/mira", this.miraRouter.getRouter());
        this.router.use("/command", this.commandRouter.getRouter());
        this.router.use("/discord-bot", this.discordBotRouter.getRouter());
        this.router.use("/report", this.reportRouter.getRouter());
        this.router.use("/guildMember", this.guildMemberRouter.getRouter());
    }
}