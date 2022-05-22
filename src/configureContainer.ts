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


const prisma = new PrismaClient();

export const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

container.register({
    discord: asClass(Discord).singleton(),
    prisma: asValue(prisma),
    activityHelper: asClass(ActivityHelper),
    logUsage: asClass(LogUsage),
    logger: asValue(logger),
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
