import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllBoardsResDto } from './dto/res/getAllBoards.res.dto';
import { GetBoardDetailResDto } from './dto/res/getBoardDetail.res.dto';
import { JwtPayload } from 'src/auth/types/jwtPayload.type';
import { User } from 'src/common/decorators/user.decorator';
import { CreateBoardReqDto } from './dto/req/createBoard.req.dto';
import { CreateBoardResDto } from './dto/res/createBoard.res.dto';
import { UpdateBoardReqDto } from './dto/req/updateBoard.req.dto';
import { UpdateBoardResDto } from './dto/res/updateBoard.res.dto';


@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}


     //게시판 리스트 불러오기
    @Public()
    @Get('/all')
    getAllBoards(): Promise<GetAllBoardsResDto[]>{
        return this.boardService.getAllBoards();
    }
     //게시판 상세보기
    @Public()
    @Get('/:boardId')
    getBoardDetail(@Param('boardId') boardId: string): Promise<GetBoardDetailResDto>{
        return this.boardService.getBoardDetail(boardId);
    }
     //게시판 등록
    @Post('')
    createBoard(@User() user: JwtPayload, @Body() dto: CreateBoardReqDto): Promise<CreateBoardResDto>{
        return this.boardService.createBoard(user, dto);
    }
     //게시판 수정
    @Patch('/:boardId')
    updateBoard(@User() user: JwtPayload, @Param('boardId') boardId: string, @Body() dto: UpdateBoardReqDto): Promise<UpdateBoardResDto>{
        return this.boardService.updateBoard(user, boardId, dto);
    }
    
}
