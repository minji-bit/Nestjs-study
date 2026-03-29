import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { SignUpReqDto } from './dto/req/signUp.req.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async signUp(dto: SignUpReqDto){
       //이메일 중복 확인
       const existedUser = await this.prisma.user.findUnique({
        where: {
            email: dto.email,
        },
       });
       if (existedUser) {
        throw new ConflictException('이메일이 이미 존재합니다.');
       }
       //비밀번호 해싱
       const hashedPassword = this.hashData(dto.password);
       //유저 생성
       const user = await this.prisma.user.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        },
       });
       return user;
    }

    hashData(data: string){
        return bcrypt.hashSync(data, 10);
    }




}
