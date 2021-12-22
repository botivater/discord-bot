import { execSync } from "child_process";

export default class Config {
    protected static revisionId: string | null = null;

    public static getBotToken(): string {
        return process.env.BOT_TOKEN || "";
    }

    public static getApplicationId(): string {
        return process.env.APPLICATION_ID || "";
    }

    public static getSystemChannelId(): string {
        return process.env.SYSTEM_CHANNEL || "";
    }

    public static getDeveloperRoleId(): string {
        return process.env.DEVELOPER_ROLE || "";
    }

    public static getRevisionId(): string {
        if (this.revisionId) return this.revisionId;
        this.revisionId = execSync("git rev-parse HEAD")
            .toString()
            .trim()
            .slice(0, 7);
        return this.revisionId;
    }
}
