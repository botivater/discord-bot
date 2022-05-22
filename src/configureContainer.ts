import { createContainer, asClass, asFunction, asValue, InjectionMode, Lifetime } from 'awilix'
import { Discord } from './discord';
import { ActivityHelper } from './discord/helpers/activityHelper';
import { DiscordService } from './web/services/v1/discord.service';
import { PrismaClient } from '@prisma/client';
import { LogUsage } from './discord/helpers/logUsage';
import { GuildMemberServiceV2 } from './web/services/v2/guildMember.service';
import { GuildConfigServiceV2 } from './web/services/v2/guildConfig.service';
import { WelcomeMessageConfigServiceV2 } from './web/services/v2/welcomeMessageConfig.service';
import { GuildServiceV2 } from './web/services/v2/guild.service';
import { CommandListService } from './web/services/v1/commandList.service';
import { CommandUsageService } from './web/services/v1/commandUsage.service';
import { DiscordBotService } from './web/services/v1/discordBot.service';
import { GuildMemberService } from './web/services/v1/guildMember.service';
import { ReportService } from './web/services/v1/report.service';
import { GuildMemberAddEvent } from './discord/events/guildMemberAdd.event';
import logger from './logger';
import { DiscordEventManager } from './discord/events/DiscordEventManager';
import { auth } from 'express-oauth2-jwt-bearer';
import Config from './common/config';
import { Web } from './web';
import { NextFunction, Request, Response } from 'express';
import APIResponse from './web/responses/APIResponse';
import express from "express";
import { V2Router } from './web/routers/v2.router';
import { UnauthorizedError } from './web/error/UnauthorizedError';


const prisma = new PrismaClient();

const apiAuthMiddleware: express.Handler = auth({
    audience: Config.getAPIAuth0Audience(),
    issuerBaseURL: `https://${Config.getAPIAuth0Domain()}`,
});

const apiTokenMiddleware: express.Handler = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-api-key'] === Config.getAPIToken()) return next();
    return res.json(APIResponse.fromError(new UnauthorizedError()));
};

export const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

container.register({
    discord: asClass(Discord).singleton(),
    web: asClass(Web).singleton(),
    prisma: asValue(prisma),
    activityHelper: asClass(ActivityHelper),
    logUsage: asClass(LogUsage),
    logger: asValue(logger),
    apiAuthMiddleware: asValue(apiAuthMiddleware),
    apiTokenMiddleware: asValue(apiTokenMiddleware),
});

// web/routers
container.register({
    v2Router: asClass(V2Router),
});

// discord/events
container.register({
    guildMemberAddEvent: asClass(GuildMemberAddEvent),
});

// web/services/v1
container.register({
    commandListService: asClass(CommandListService),
    commandUsageService: asClass(CommandUsageService),
    discordService: asClass(DiscordService),
    discordBotService: asClass(DiscordBotService),
    guildMemberService: asClass(GuildMemberService),
    reportService: asClass(ReportService),
});

// web/services/v2
container.register({
    guildServiceV2: asClass(GuildServiceV2),
    guildMemberServiceV2: asClass(GuildMemberServiceV2),
    guildConfigServiceV2: asClass(GuildConfigServiceV2),
    welcomeMessageConfigServiceV2: asClass(WelcomeMessageConfigServiceV2),
});

container.build(DiscordEventManager);
