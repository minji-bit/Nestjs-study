import { JwtPayload } from "./jwtPayload.type";

export class RtJwtPayload{
    refreshToken: string;
    payload: JwtPayload;
}