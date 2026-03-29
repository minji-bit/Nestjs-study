import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignUpReqDto } from './dto/req/signUp.req.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    // 1- 회원가입
    @Public()
    @Post('/signup')
    signUp(@Body() dto: SignUpReqDto) {
        return this.authService.signUp(dto);
    }

}
