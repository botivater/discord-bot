import { execSync } from "child_process";

export default class Config {
    protected static revisionId: string | null = null;

    public static getBotToken(): string {
        if (!process.env.BOT_TOKEN) throw new Error("Missing BOT_TOKEN");
        return process.env.BOT_TOKEN;
    }

    public static getApplicationId(): string {
        if (!process.env.APPLICATION_ID)
            throw new Error("Missing APPLICATION_ID");
        return process.env.APPLICATION_ID;
    }

    public static getRevisionId(): string {
        if (this.revisionId) return this.revisionId;
        this.revisionId = execSync("git rev-parse HEAD")
            .toString()
            .trim()
            .slice(0, 10);
        return this.revisionId;
    }

    public static getDatabaseName(): string {
        if (!process.env.DATABASE_NAME)
            throw new Error("Missing DATABASE_NAME");
        return process.env.DATABASE_NAME;
    }

    public static getDatabaseURL(): string {
        if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
        return process.env.DATABASE_URL;
    }

    public static getAPIPort(): number {
        return Number(process.env.API_PORT || "3000");
    }

    public static getAPIAuth0Domain(): string {
        if (!process.env.API_AUTH0_DOMAIN)
            throw new Error("Missing API_AUTH0_DOMAIN");
        return process.env.API_AUTH0_DOMAIN;
    }

    public static getAPIAuth0ClientId(): string {
        if (!process.env.API_AUTH0_CLIENT_ID)
            throw new Error("Missing API_AUTH0_CLIENT_ID");
        return process.env.API_AUTH0_CLIENT_ID;
    }

    public static getAPIAuth0Audience(): string {
        if (!process.env.API_AUTH0_AUDIENCE)
            throw new Error("Missing API_AUTH0_AUDIENCE");
        return process.env.API_AUTH0_AUDIENCE;
    }
}
