import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {  GetAllBoardsResDto } from './dto/res/getAllBoards.res.dto';
import { GetBoardDetailResDto } from './dto/res/getBoardDetail.res.dto';
import { CreateBoardReqDto } from './dto/req/createBoard.req.dto';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { CreateBoardResDto } from './dto/res/createBoard.res.dto';
import { UpdateBoardReqDto } from './dto/req/updateBoard.req.dto';
import { UpdateBoardResDto } from './dto/res/updateBoard.res.dto';


@Injectable()
export class BoardService {
    constructor(private readonly prisma: PrismaService) {}


    async getAllBoards(): Promise<GetAllBoardsResDto[]> {
        const boards = await this.prisma.board.findMany({
            select: {
                id: true,
                title: true,
                user: {      //user 테이블과 조인하여 유저 정보 가져오기
                    select: {
                        name: true,
                    },
                },
                 createdAt: true,
                 updatedAt: true,
            },
        });
        return boards;
    }

    async getBoardDetail(boardId: string): Promise<GetBoardDetailResDto> {
        const board = await this.prisma.board.findUnique({
            where: {
                id: boardId,
            },
            select: {
                id: true,
                title: true,
                body: true,
                user: {
                    select: {  //user 테이블과 조인하여 유저 정보 가져오기
                        name: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        if(!board) {
            throw new NotFoundException('Board not found');
        }
        return board;
    }


    async createBoard(user: JwtPayload, dto: CreateBoardReqDto): Promise<CreateBoardResDto>{
        const board = await this.prisma.board.create({
            data: {
                title: dto.title,
                body: dto.body,
                userId: user.id
            },
        });
        return board;
    }


    async updateBoard(user: JwtPayload, boardId: string, dto: UpdateBoardReqDto): Promise<UpdateBoardResDto>{
       const board = await this.prisma.board.findUnique({
        where: {
            id: boardId,
        }
        });
        if(!board) {
            throw new NotFoundException('Board not found');
        }
        //작성자와 수정자가 동일해야함
        if(board.userId !== user.id) {  
            throw new ForbiddenException('You are not the owner of this board');
        }
        const updatedBoard = await this.prisma.board.update({
            where: {
                id: boardId,
            },
            data: {
                title: dto.title,
                body: dto.body,
            },
        });
        return updatedBoard;
    
    }

}

