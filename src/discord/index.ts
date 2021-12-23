import { CacheType, Client, Intents, Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { inlineCode, SlashCommandBuilder } from "@discordjs/builders";
import Config from "../common/config";
import { logger } from "../logger";
import { syncAllUsersInAllGuilds } from "./sync";
import collectors from "./collectors";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js/node_modules/discord-api-types";
import PronounChecker from "../common/pronounChecker";

// Commands
import ping from "./commands/ping";
import cat from "./commands/cat";
import selfcare from "./commands/selfcare";
import toneindicator from "./commands/toneindicator";
import dev from "./commands/dev";
import findafriend from "./commands/findafriend";
import whatareyouthinkingabout from "./commands/whatareyouthinkingabout";
import statistics from "./commands/statistics";
import affirmations from "./commands/affirmations";
import treat from "./commands/treat";
import setBirthday from "./commands/set-birthday";

export type CommandMap = {
  [index: string]: (interaction: Interaction) => Promise<void>;
};

export type CommandSignature = {
  command: SlashCommandBuilder;
  handle: (interaction: Interaction) => Promise<void>;
};

export default class Discord {
  // eslint-disable-next-line no-use-before-define
  protected static instance: Discord | null = null;

  protected client: Client;

  protected commandMap: CommandMap = {};
  protected restCommandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

  constructor() {
    logger.info("Discord bot is starting up.");

    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
    });

    this.registerCommands();

    this.client.once("ready", this.handleReadyEvent.bind(this));
    this.client.on(
      "interactionCreate",
      this.handleInteractionCreate.bind(this)
    );

    this.client.login(process.env.BOT_TOKEN);
  }

  protected async handleReadyEvent() {
    const channel = this.client.channels.cache.get(Config.getSystemChannelId());

    if (channel && channel.isText()) {
      // channel.send(`Miauw! Revision: ${inlineCode(Config.getRevisionId())}`);
    }

    this.client?.user?.setPresence({
      activities: [{ name: "Lauri", type: "LISTENING" }],
    });

    // Do a first sync on startup.
    syncAllUsersInAllGuilds(this.client);

    // Background sync for user name changes etc.
    setInterval(() => {
      const discordClient = Discord.getInstance().client;

      syncAllUsersInAllGuilds(discordClient);
    }, 60000);

    logger.info("Discord bot is ready.");

    // Setup the collectors
    // These process the reactions to messages like auto-role adds.
    collectors.setup(this.client);

    this.client.on("messageReactionAdd", (reaction, user) => {
      if (reaction.message.channelId === Config.getSystemChannelId()) {
        // console.log(reaction, user);

        if (user.bot) return;

        const guild = this.client.guilds.cache.get("803327192662671463");
        if (!guild) return;

        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        let newNickname = guildMember.nickname || "";

        const pronouns = PronounChecker.getPronouns(newNickname).join("/");

        switch (reaction.emoji.name) {
          case "🟦":
            if (pronouns) {
              newNickname = newNickname.replace(pronouns, "hij/hem");
            } else {
              newNickname = `${newNickname} hij/hem`;
            }
            break;

          case "🟥":
            if (pronouns) {
              newNickname = newNickname.replace(pronouns, "zij/haar");
            } else {
              newNickname = `${newNickname} zij/haar`;
            }
            break;

          case "🟩":
            if (pronouns) {
              newNickname = newNickname.replace(pronouns, "hen/hun");
            } else {
              newNickname = `${newNickname} hen/hun`;
            }
            break;

          case "🟨":
            if (pronouns) {
              newNickname = newNickname.replace(pronouns, "die/diens");
            } else {
              newNickname = `${newNickname} die/diens`;
            }
            break;
        }

        guildMember.setNickname(newNickname);
      }
    });

    this.client.on("messageReactionRemove", (reaction, user) => {
      if (reaction.message.channelId === Config.getSystemChannelId()) {
        // console.log(reaction, user);

        if (user.bot) return;

        const guild = this.client.guilds.cache.get("803327192662671463");
        if (!guild) return;

        const guildMember = guild.members.cache.get(user.id);
        if (!guildMember) return;

        let newNickname = guildMember.nickname || "";

        const pronouns = PronounChecker.getPronouns(newNickname).join("/");
        newNickname = newNickname.replace(pronouns, "unknown");

        guildMember.setNickname(newNickname);
      }
    });
  }

  protected async handleInteractionCreate(interaction: Interaction<CacheType>) {
    if (interaction.isCommand()) {
      const { commandName } = interaction;

      if (this.commandMap.hasOwnProperty(commandName)) {
        this.commandMap[commandName](interaction);
      }
    }
  }

  protected registerCommand(command: CommandSignature) {
    this.restCommandArray.push(command.command.toJSON());
    this.commandMap[command.command.name] = command.handle;
  }

  protected registerCommands() {
    this.registerCommand(ping);
    this.registerCommand(cat);
    this.registerCommand(findafriend);
    this.registerCommand(selfcare);
    this.registerCommand(whatareyouthinkingabout);
    this.registerCommand(affirmations);
    this.registerCommand(toneindicator);
    this.registerCommand(dev);
    this.registerCommand(statistics);
    this.registerCommand(treat);
    this.registerCommand(setBirthday);

    // Register commands
    const rest = new REST({ version: "9" }).setToken(Config.getBotToken());

    // Globally register commands
    rest.put(Routes.applicationCommands(Config.getApplicationId()), {
      body: [],
    });

    // Prod server commands
    // TODO: Remove me!
    rest.put(
      Routes.applicationGuildCommands(
        Config.getApplicationId(),
        "803327192662671463"
      ),
      {
        body: this.restCommandArray,
      }
    );
  }

  public static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new Discord();
    return this.instance;
  }

  public getClient(): Client {
    return this.client;
  }
}
