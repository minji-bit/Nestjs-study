import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserReqDto } from './dto/createUser.req.dto';
import { UpdateUserReqDto } from './dto/updateUser.req.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(dto: CreateUserReqDto){
        await this.prisma.user.create({
            data:{
                email: dto.email,
                name: dto.name,
            }
        })
    }

    async getUser(){
        const user = await this.prisma.user.findMany();
        return user;
    }

    async getUserDetail(userid: string){

        const user = await this.prisma.user.findUnique({
            where : {
                id: parseInt(userid),
            },
            select : {
                email : true,
            }
        })
        return user;
    }

    async updateUser(dto: UpdateUserReqDto){
      const user = await this.prisma.user.update({
        where :{
            id: parseInt(dto.id),
        },
        data :{
            name: dto.name,
        }
      });
      return user;
    }
  }

