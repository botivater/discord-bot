import { Prisma, PrismaClient, WelcomeMessageConfig } from "@prisma/client";
import { NotFoundError } from "../../error/NotFoundError";
import { IWelcomeMessageConfigService } from "./IWelcomeMessageConfig.service";


export class WelcomeMessageConfigNotFound extends NotFoundError {};
export class WelcomeMessageConfigNotCreated extends Error {};

export class WelcomeMessageConfigServiceV2 implements IWelcomeMessageConfigService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(where: Prisma.WelcomeMessageConfigWhereInput): Promise<WelcomeMessageConfig[]> {
        return this.prisma.welcomeMessageConfig.findMany({
            where
        });
    }

    async findOne(where: Prisma.WelcomeMessageConfigWhereUniqueInput): Promise<WelcomeMessageConfig> {
        const welcomeMessageConfig = await this.prisma.welcomeMessageConfig.findUnique({
            where
        });
        if (!welcomeMessageConfig) throw new WelcomeMessageConfigNotFound(String(where.id));

        return welcomeMessageConfig;
    }

    async create(data: Prisma.WelcomeMessageConfigCreateInput & { guildConfigId: number }): Promise<WelcomeMessageConfig> {
        const welcomeMessageConfig = await this.prisma.welcomeMessageConfig.create({
            data: {
                format: data.format,
                channelSnowflake: data.channelSnowflake,
                GuildConfig: {
                    connect: {
                        id: data.guildConfigId
                    }
                }
            }
        });
        if (!welcomeMessageConfig) throw new WelcomeMessageConfigNotCreated();

        return welcomeMessageConfig;
    }

    async update(where: Prisma.WelcomeMessageConfigWhereUniqueInput, data: Prisma.WelcomeMessageConfigUpdateInput): Promise<WelcomeMessageConfig> {
        const welcomeMessageConfig = await this.prisma.welcomeMessageConfig.findUnique({
            where
        });
        if (!welcomeMessageConfig) throw new WelcomeMessageConfigNotFound(String(where.id));

        const updatedWelcomeMessageConfig = await this.prisma.welcomeMessageConfig.update({
            where,
            data
        });

        return updatedWelcomeMessageConfig;
    }

    async delete(where: Prisma.WelcomeMessageConfigWhereUniqueInput): Promise<void> {
        const welcomeMessageConfig = await this.prisma.welcomeMessageConfig.findUnique({
            where
        });
        if (!welcomeMessageConfig) throw new WelcomeMessageConfigNotFound(String(where.id));

        await this.prisma.welcomeMessageConfig.delete({
            where
        });
    }
}
