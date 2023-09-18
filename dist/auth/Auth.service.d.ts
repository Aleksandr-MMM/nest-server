import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private jwtService;
    protected payloadRemove(obj: any): {
        email: any;
        id: any;
    };
    constructor(jwtService: JwtService);
    protected getToken(obj: object): Promise<{
        access_token: string;
    }>;
    identificationMe(user: any): {
        email: any;
        id: any;
    };
    signIn(email: string, id: string): Promise<any>;
    getTemporaryToken(email: string, pass: string): Promise<{
        access_token: string;
    }>;
    token(token: string): Promise<any>;
}
