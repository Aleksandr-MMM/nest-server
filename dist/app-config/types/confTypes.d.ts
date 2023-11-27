export interface IAppConfig {
    environment: 'production' | 'development';
    names: string[];
}
export interface IDbConfig {
    raven: {
        database: string;
        url: string;
        certificate: string;
        passphrase: string;
    };
}
export interface IMailConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}
