import { JwtService } from "@nestjs/jwt";
import { Role } from "../guard/RoleGuard/role.enum";
export declare class AuthService {
    private jwtService;
    protected returnMailAndId(obj: any): {
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
    signIn(email: string, id: string, roles: Role[]): Promise<{
        access_token: string;
    }>;
    getTemporaryToken(email: string, pass: string, roles: Role[]): Promise<{
        access_token: string;
    }>;
    token(token: string): Promise<any>;
}
