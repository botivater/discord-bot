export default class MissingParameterError extends Error {
    constructor(parameter?: string) {
        super();
        this.name = "Missing parameter";
        this.message = parameter
            ? `Missing parameter: ${parameter}`
            : "Missing parameter(s).";
    }
}
