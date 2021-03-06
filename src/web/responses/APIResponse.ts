import GuildChannelNotFoundError from "../error/GuildChannelNotFoundError";
import GuildChannelNotTextChannelError from "../error/GuildChannelNotTextChannelError";
import GuildNotFoundError from "../error/GuildNotFoundError";
import MissingParameterError from "../error/MissingParameterError";
import NotImplementedError from "../error/NotImplementedError";
import RouteNotFoundError from "../error/RouteNotFoundError";
import logger from "../../logger";
import { UnauthorizedError } from "../error/UnauthorizedError";
import APIResponseDto from "../dto/APIResponse.dto";
import { StatusCode } from "../enum/StatusCode";

export default class APIResponse<T> implements APIResponseDto<T> {
    public status: string;
    public statusCode: number;
    public data?: T | undefined;
    public error?: T | undefined;

    constructor(data: { statusCode: StatusCode; data?: T; error?: T }) {
        this.status = StatusCode[data.statusCode];
        this.statusCode = data.statusCode;
        this.data = data.data;
        this.error = data.error;
    }

    public static fromData<T>(statusCode: StatusCode, data: T) {
        return new APIResponse<T>({ statusCode, data });
    }

    public static fromError(error: any) {
        switch (true) {
            case error instanceof UnauthorizedError:
                return new APIResponse({
                    statusCode: StatusCode.UNAUTHORIZED,
                    error,
                });

            case error instanceof NotImplementedError:
                return new APIResponse({
                    statusCode: StatusCode.NOT_IMPLEMENTED,
                    error,
                });

            case error instanceof RouteNotFoundError:
                return new APIResponse({
                    statusCode: StatusCode.NOT_IMPLEMENTED,
                    error,
                });

            case error instanceof MissingParameterError:
                return new APIResponse({
                    statusCode: StatusCode.BAD_REQUEST,
                    error,
                });

            case error instanceof GuildNotFoundError:
                return new APIResponse({
                    statusCode: StatusCode.NOT_FOUND,
                    error,
                });

            case error instanceof GuildChannelNotFoundError:
                return new APIResponse({
                    statusCode: StatusCode.NOT_FOUND,
                    error,
                });

            case error instanceof GuildChannelNotTextChannelError:
                return new APIResponse({
                    statusCode: StatusCode.BAD_REQUEST,
                    error,
                });

            case error instanceof UnauthorizedError:
                return new APIResponse({
                    statusCode: StatusCode.UNAUTHORIZED,
                    error
                });

            case error instanceof Error:
                if (error instanceof Error) {
                    return new APIResponse({
                        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                        error: error.message,
                    });
                }

            case error instanceof String:
                return new APIResponse({
                    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                    error,
                });

            default:
                logger.error(error);

                return new APIResponse({
                    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                    error: "An unknown error occurred.",
                });
        }
    }
}
