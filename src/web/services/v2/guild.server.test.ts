import { Guild } from "@prisma/client";
import { Context, createMockContext, MockContext,  } from "../../../../tests/context";
import { GuildNotFound, GuildServiceV2 } from "./guild.service";

let mockCtx: MockContext
let ctx: Context

const guilds: Guild[] = [
    {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Jonas' First Guild",
        snowflake: "1234",
        configId: null
    },
    {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Jonas' Second Guild",
        snowflake: "5678",
        configId: null
    }
];

beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
})

test('GuildServiceV2 constructs', () => {
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    expect(guildServiceV2).toBeInstanceOf(GuildServiceV2);
});

test('GuildServiceV2.findAll returns multiple Guilds', async () => {
    mockCtx.prisma.guild.findMany.mockResolvedValue(guilds);
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.findAll({})).resolves.toEqual(guilds);
});

test('GuildServiceV2.findAll where id: 1 returns one Guild', async () => {
    mockCtx.prisma.guild.findMany.mockResolvedValue([guilds[0]]);
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.findAll({
        id: {
            equals: 1
        }
    })).resolves.toEqual([guilds[0]]);
});

test('GuildServiceV2.findOne returns one Guild', async () => {
    mockCtx.prisma.guild.findUnique.mockResolvedValue(guilds[0]);
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.findOne({
        id: 1
    })).resolves.toEqual(guilds[0]);
});

test('GuildServiceV2.findOne throws GuildNotFound error', async () => {
    mockCtx.prisma.guild.findUnique.mockResolvedValue(null);
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.findOne({
        id: 1
    })).rejects.toEqual(new GuildNotFound("1"));
});

test('GuildServiceV2.create returns a Method not implemented error', async () => {
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.create(guilds[0])).rejects.toEqual(new Error("Method not implemented."));
});

test('GuildServiceV2.update returns a Method not implemented error', async () => {
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.update({ id: guilds[0].id }, guilds[0])).rejects.toEqual(new Error("Method not implemented."));
});

test('GuildServiceV2.delete returns a Method not implemented error', async () => {
    const guildServiceV2 = new GuildServiceV2(ctx.prisma);

    await expect(guildServiceV2.delete({ id: guilds[0].id })).rejects.toEqual(new Error("Method not implemented."));
});
