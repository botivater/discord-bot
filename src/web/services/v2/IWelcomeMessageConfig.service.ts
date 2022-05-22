import { WelcomeMessageConfig, Prisma } from "@prisma/client";

export interface IWelcomeMessageConfigService {
    findAll(where: Prisma.WelcomeMessageConfigWhereInput): Promise<WelcomeMessageConfig[]>;
    findOne(where: Prisma.WelcomeMessageConfigWhereUniqueInput): Promise<WelcomeMessageConfig>;
    create(data: Prisma.WelcomeMessageConfigCreateInput): Promise<WelcomeMessageConfig>;
    update(where: Prisma.WelcomeMessageConfigWhereUniqueInput, data: Prisma.WelcomeMessageConfigUpdateInput): Promise<WelcomeMessageConfig>;
    delete(where: Prisma.WelcomeMessageConfigWhereUniqueInput): Promise<void>;
}