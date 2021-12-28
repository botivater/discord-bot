import APIResponseDto from "../dto/APIResponse.dto";
import { StatusCode } from "../enum/StatusCode";

export default class APIResponse<T> implements APIResponseDto<T> {
    public status: string;
    public statusCode: number;
    public data?: T | undefined;
    public error?: string | undefined;

    constructor(data: { statusCode: StatusCode; data?: T; error?: string }) {
        this.status = StatusCode[data.statusCode];
        this.statusCode = data.statusCode;
        this.data = data.data;
        this.error = data.error;
    }

    public static fromData<T>(statusCode: StatusCode, data: T) {
        return new APIResponse<T>({ statusCode, data });
    }

    public static fromError(statusCode: StatusCode, error: string) {
        return new APIResponse<null>({ statusCode, error });
    }
}
