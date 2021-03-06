import Handlebars from "handlebars";
import { Discord } from "../..";
import { container } from "../../../configureContainer";

export enum SendMessageTo {
    SENDER = 0,
    USER = 1,
    CHANNEL = 2,
}

export type SendMessageConfiguration = {
    toType: SendMessageTo;
    to: string;
    messageFormat: string;
    messageParameters: any;
}

Handlebars.registerHelper('pickFirstName', function(name) {
    return name.split(" ")[0];
});

const handle = async (configuration: SendMessageConfiguration) => {
    const client: Discord = container.resolve('discord');

    const stringTemplate = Handlebars.compile(configuration.messageFormat);

    switch (configuration.toType) {
        case SendMessageTo.SENDER:
        case SendMessageTo.USER:
            const user = client.users.cache.get(configuration.to);
            if (!user) return;

            user.send(stringTemplate(configuration.messageParameters));
            return;

        case SendMessageTo.CHANNEL:
            const channel = client.channels.cache.get(configuration.to);
            if (!channel || !(channel.isText() || channel.isThread())) return;

            channel.send(stringTemplate(configuration.messageParameters));
            return;
    }
};

export default {
    handle,
};
