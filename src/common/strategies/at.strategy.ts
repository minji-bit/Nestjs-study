import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy,ExtractJwt } from "passport-jwt";
import { Reflector } from "@nestjs/core";

type JwtPayload = {
    id: string;
    email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private reflector: Reflector) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        })
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
