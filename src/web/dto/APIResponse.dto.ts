export default interface APIResponseDto<T> {
    status: string;
    statusCode: number;
    data?: T;
    error?: T;
}
