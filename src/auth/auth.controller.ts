import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignUpReqDto } from './dto/req/signUp.req.dto';
import { SignInReqDto } from './dto/req/signIn.req.dto';

import { Tokens } from './dto/res/tokens.type';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from './types/jwtPayload.type';
import { AuthGuard } from '@nestjs/passport';
import { RtJwtPayload } from './types/rtjwtPayload.type';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // 1- 회원가입
    @Public() // 인증필요없이 접근 가능
    @Post('/signup')
    signUp(@Body() dto: SignUpReqDto) : Promise<void>{
        return this.authService.signUp(dto);
    }
    // 2- 로그인
    @Public() // 인증필요없이 접근 가능
    @Post('/signin')
    signIn(@Body() dto: SignInReqDto) : Promise<Tokens>{
        return this.authService.signIn(dto);
    }

    // 3- 로그아웃
    @Post('/logout')
    logout(@User() user: JwtPayload) : Promise<void>{
        console.log(user);
        return this.authService.logout(user);
    }
    
    // 4- 토큰 갱신
    @Public()
    @UseGuards(AuthGuard('jwt-refresh')) //rt strategy 사용
    @Post('/refresh')
    refreshAccessToken(@User() user: RtJwtPayload) : Promise<Tokens>{
        return this.authService.refreshAccessToken(user);
    }
}
