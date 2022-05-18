export default class RouteNotFoundError extends Error {
    constructor(route?: string) {
        super();
        this.name = "Route not found";
        this.message = route
            ? `No route was found with path: ${route}`
            : "No route was found with that path.";
    }
}
