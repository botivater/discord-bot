import { Client, MessageReaction, User } from "discord.js";
import Config from "../../common/config";

type RolePicker = {
  title: string;
  description?: string;
  options: RolePickerOptions[];
};

type RolePickerOptions = {
  emoji: string;
  text: string;
};

export const setup = async (client: Client) => {
  const channel = client.channels.cache.get(Config.getSystemChannelId());

  if (!(channel && channel.isText())) return;

  channel.messages.fetch();

  const rolePicker: RolePicker = {
    title: "Kies hier je voornaamwoorden.",
    description:
      "Als je voornaamwoorden mist laat het dan aan een Dev weten, dan voegen wij deze toe.",
    options: [
      {
        emoji: "🟦",
        text: "Hij/Hem",
      },
      {
        emoji: "🟥",
        text: "Zij/Haar",
      },
      {
        emoji: "🟩",
        text: "Hen/Hun",
      },
      {
        emoji: "🟨",
        text: "Die/Diens",
      },
    ],
  };

  let messageContent = `${rolePicker.title}\n`;

  rolePicker.options.forEach((option) => {
    messageContent += `${option.emoji} ${option.text}\n`;
  });

  if (rolePicker.description) {
    messageContent += `\n${rolePicker.description}`;
  }

  const message = await channel.send({
    content: messageContent,
  });

  for (const option of rolePicker.options) {
    await message.react(option.emoji);
  }
};

export default {
  setup,
};
