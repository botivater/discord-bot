export default class GuildChannelNotTextChannelError extends Error {
    constructor(id?: string) {
        super();
        this.name = "Guild channel not text channel";
        this.message = id
            ? `Guild channel with ID '${id}' is not a text channel. `
            : "Guild channel is not a text channel.";
    }
}
