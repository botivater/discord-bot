export default class Config {
    public static getDatabaseURL(): string {
        if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
        return process.env.DATABASE_URL;
    }

    public static getLogLevel(): string {
        if (!process.env.LOG_LEVEL) throw new Error("Missing LOG_LEVEL");
        return process.env.LOG_LEVEL;
    }

    public static getAPIToken(): string {
        if (!process.env.API_TOKEN) throw new Error("Missing API_TOKEN");
        return process.env.API_TOKEN;
    }

    public static getApplicationId(): string {
        if (!process.env.APPLICATION_ID)
            throw new Error("Missing APPLICATION_ID");
        return process.env.APPLICATION_ID;
    } 

    public static getBotToken(): string {
        if (!process.env.BOT_TOKEN) throw new Error("Missing BOT_TOKEN");
        return process.env.BOT_TOKEN;
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
