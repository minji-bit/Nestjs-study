import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { SignUpReqDto } from './dto/req/signUp.req.dto';
import * as bcrypt from 'bcrypt';
import { SignInReqDto } from './dto/req/signIn.req.dto';
import { Tokens } from './dto/res/tokens.type';
import { JwtPayload } from './types/jwtPayload.type';
import { RtJwtPayload } from './types/rtjwtPayload.type';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async signUp(dto: SignUpReqDto): Promise<void>{
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
    //    return user;
    }

    hashData(data: string){
        return bcrypt.hashSync(data, 10);
    }

    async signIn(dto: SignInReqDto): Promise<Tokens>{
        //이메일 유저 확인
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if(!user) {
            throw new NotFoundException('이메일이 존재하지 않습니다.');
        }
        //비밀번호 일치여부 확인
        const comparePassword = await bcrypt.compare(dto.password, user.password);
        if(!comparePassword) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        //토큰 발급
        const tokens = await this.getTokens(user.id, user.email, user.name);
        //RT 해쉬 업데이트
        const hashedRt = this.hashData(tokens.refreshToken);

        await this.prisma.user.update({
            where: {
                id: user.id,
            },  
            data: {
                hashedRt: hashedRt,
            },
        })
        return tokens;
    }

    async getTokens(userId: string, email: string, name: string){
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                id: userId,
                email: email,
                name: name,
            },{
                secret : 'secret',
                expiresIn: 60 * 15, // 15분 유효
            }),
            this.jwtService.signAsync({
                id: userId,
                email: email,
                name: name,
            },{
                secret : 'rtsecret',
                expiresIn: 60 * 60 * 24 * 7, // 7일 유효
            }),
        ])
        return {
            accessToken: at,
            refreshToken: rt,
        }
    }

    async logout(user: JwtPayload): Promise<void>{
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                hashedRt: null,
            },
        })
        return
    }
    
    async refreshAccessToken(user: RtJwtPayload): Promise<Tokens>{
        //user.id 유저 존재하는지 확인
        const existedUser = await this.prisma.user.findUnique({
            where: {
                id: user.payload.id,
                hashedRt: {
                    not: null,  //로그아웃을 한 상태이면 안된다.
                },
            },
        })
        if(!existedUser) {
            throw new NotFoundException('유저가 존재하지 않습니다.');
        }
        //refresh token 유효한지 체크
        const rtMatches = await bcrypt.compare(user.refreshToken, existedUser.hashedRt);
        if(!rtMatches) {
            throw new ForbiddenException('Refresh token is invalid');
        }
        //token 재발급
        const tokens = await this.getTokens(existedUser.id, existedUser.email, existedUser.name);
        //해쉬 RT 업데이트
        const hashedRt = this.hashData(tokens.refreshToken);

        await this.prisma.user.update({
            where: {
                id: existedUser.id,
            },
            data: {
                hashedRt: hashedRt,
            },
        })

        //토큰 리턴
        return tokens;

    }



}
