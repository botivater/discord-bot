import { PrismaClient } from "@prisma/client";

class Database {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = new PrismaClient();
    }

    public getPrisma() {
        return this.prisma;
    }
}

export default new Database();