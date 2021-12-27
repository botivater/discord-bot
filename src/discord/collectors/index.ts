import emojis from "@/common/emojis";
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

    await channel.messages.fetch();

    const rolePicker: RolePicker = {
        title: "Kies hier je voornaamwoorden.",
        description:
            "Als je voornaamwoorden mist laat het dan aan een Dev weten, dan voegen wij deze toe.",
        options: [
            {
                emoji: emojis[1],
                text: "Hij",
            },
            {
                emoji: emojis[2],
                text: "Hem",
            },
            {
                emoji: emojis[3],
                text: "Zij",
            },
            {
                emoji: emojis[4],
                text: "Haar",
            },
            {
                emoji: emojis[5],
                text: "Hen",
            },
            {
                emoji: emojis[6],
                text: "Hun",
            },
            {
                emoji: emojis[7],
                text: "Die",
            },
            {
                emoji: emojis[8],
                text: "Diens",
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
