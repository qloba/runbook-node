interface Config {
    baseUrl: string;
    apiToken: string;
}
export default class runbook {
    baseUrl: string;
    apiToken: string;
    constructor(config: Config);
    postData(data: object): Promise<string | undefined>;
    getEndpoint(): string;
    query(name: string, variables: object): Promise<string | undefined>;
}
export {};
