export declare const handler: (event: any) => Promise<{
    statusCode: number;
    body: string;
    headers?: undefined;
} | {
    statusCode: number;
    headers: {
        'Access-Control-Allow-Origin': any;
        'Access-Control-Allow-Headers': string;
        'Access-Control-Allow-Methods': string;
    };
    body: string;
}>;
