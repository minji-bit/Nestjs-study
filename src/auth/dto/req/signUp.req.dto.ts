import { ApiProperty } from "@nestjs/swagger";

export class SignUpReqDto {
    @ApiProperty({
        description: '이메일',
        example: 'test@example.com'
    })
    email: string;
    @ApiProperty({
        description: '비밀번호',
        example: 'password123'
    })
    password: string;
    @ApiProperty({
        description: '이름',
        example: '홍길동'
    })
    name: string;
}