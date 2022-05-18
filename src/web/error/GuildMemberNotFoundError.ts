export default class GuildMemberNotFoundError extends Error {
    constructor(id?: string) {
        super();
        this.name = "Guild member not found";
        this.message = id
            ? `No guild member was found with ID: ${id}`
            : "No guild member was found with that filter.";
    }
}
