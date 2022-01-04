export default class NotImplementedError extends Error {
    constructor(route?: string) {
        super();
        this.name = "Not implemented";
        this.message = route
            ? `Route '${route}' is not implemented.`
            : "Route is not implemented.";
    }
}
