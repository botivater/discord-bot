import { execSync } from "child_process";

export enum BotMode {
    DEVELOPMENT = "dev",
    TESTING = "test",
    PRODUCTION = "prod",
}

export default class Config {
    protected static revisionId: string | null = null;

    public static getBotMode(): string {
        if (!process.env.BOT_MODE) throw new Error("Missing MODE");

        if (!Object.values(BotMode).includes(<any>process.env.BOT_MODE))
            throw new Error("Incorrect MODE");

        return process.env.BOT_MODE;
    }

    public static getBotToken(): string {
        if (!process.env.BOT_TOKEN) throw new Error("Missing BOT_TOKEN");
        return process.env.BOT_TOKEN;
    }

    public static getApplicationId(): string {
        if (!process.env.APPLICATION_ID)
            throw new Error("Missing APPLICATION_ID");
        return process.env.APPLICATION_ID;
    }

    public static getSystemChannelId(): string {
        if (!process.env.SYSTEM_CHANNEL)
            throw new Error("Missing SYSTEM_CHANNEL");
        return process.env.SYSTEM_CHANNEL;
    }

    public static getOwnerRoleId(): string {
        if (!process.env.OWNER_ROLE) throw new Error("Missing OWNER_ROLE");
        return process.env.OWNER_ROLE;
    }

    public static getModeratorRoleId(): string {
        if (!process.env.MODERATOR_ROLE)
            throw new Error("Missing MODERATOR_ROLE");
        return process.env.MODERATOR_ROLE;
    }

    public static getDeveloperRoleId(): string {
        if (!process.env.DEVELOPER_ROLE)
            throw new Error("Missing DEVELOPER_ROLE");
        return process.env.DEVELOPER_ROLE;
    }

    public static getRevisionId(): string {
        if (this.revisionId) return this.revisionId;
        this.revisionId = execSync("git rev-parse HEAD")
            .toString()
            .trim()
            .slice(0, 10);
        return this.revisionId;
    }
}
