import { DiscordController } from "../../controllers/v1/Discord.controller";
import { Router } from "../Router";


export class DiscordRouter extends Router {
    private discordController: DiscordController;

    /**
     *
     */
    constructor() {
        super();
        this.discordController = new DiscordController();

        // Index
        this.router.get("/", this.discordController.index.bind(this.discordController));

        // Guilds
        this.router.get("/guilds", this.discordController.getAllGuilds.bind(this.discordController));
        this.router.get("/guilds/:id", this.discordController.getGuild.bind(this.discordController));
        this.router.get("/guilds/:id/channels", this.discordController.getGuildChannels.bind(this.discordController));
        this.router.get("/guilds/:id/members", this.discordController.getGuildMembers.bind(this.discordController));
        this.router.get("/guilds/:id/roles", this.discordController.getGuildRoles.bind(this.discordController));

        // Reaction collector
        this.router.get("/reactionCollectors", this.discordController.getAllReactionCollectors.bind(this.discordController));
        this.router.get("/reactionCollectors/:id", this.discordController.getReactionCollector.bind(this.discordController));
        this.router.post("/reactionCollectors", this.discordController.createReactionCollector.bind(this.discordController));
        this.router.delete("/reactionCollectors/:id", this.discordController.deleteReactionCollector.bind(this.discordController));
    }
}