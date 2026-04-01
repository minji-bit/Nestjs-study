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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // 1- 회원가입
    @ApiOperation({
        summary: '회원가입',
        description: '이메일과 비밀번호로 회원가입'
    })
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
    })
    @ApiResponse({
        status: 409,
        description: '이메일 중복',
    })
    @Public() // 인증필요없이 접근 가능
    @Post('/signup')
    signUp(@Body() dto: SignUpReqDto) : Promise<void>{
        return this.authService.signUp(dto);
    }
    // 2- 로그인
    @ApiOperation({
        summary: '로그인',
        description: '이메일과 비밀번호로 로그인'
    })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        type: Tokens
    })
    @ApiResponse({
        status: 401,
        description: '이메일 또는 비밀번호 오류',
    })
    @ApiResponse({
        status: 404,
        description: '사용자 없음',
    })
    @Public() // 인증필요없이 접근 가능
    @Post('/signin')
    signIn(@Body() dto: SignInReqDto) : Promise<Tokens>{
        return this.authService.signIn(dto);
    }

      // 3- 로그아웃
    @ApiOperation({
        summary: '로그아웃',
        description: '로그아웃'
    })
    @ApiResponse({
        status: 201,
        description: '로그아웃 성공',
    })
    @ApiResponse({
        status: 401,
        description: '토큰 만료',
    })
    @ApiBearerAuth('accessToken')
    @Post('/logout')
    logout(@User() user: JwtPayload) : Promise<void>{
        console.log(user);
        return this.authService.logout(user);
    }
    
    // 4- 토큰 갱신
    @ApiOperation({
        summary: '토큰 갱신',
        description: '토큰 갱신'
    })
    @ApiResponse({
        status: 200,
        description: '토큰 갱신 성공',
        type: Tokens
    })
    @ApiResponse({
        status: 403,
        description: '토큰 갱신 실패',
    })
    @ApiResponse({
        status: 404,
        description: '사용자 없음',
    })
    @ApiBearerAuth('refreshToken')
    @Public()
    @UseGuards(AuthGuard('jwt-refresh')) //rt strategy 사용
    @Post('/refresh')
    refreshAccessToken(@User() user: RtJwtPayload) : Promise<Tokens>{
        return this.authService.refreshAccessToken(user);
    }
}
