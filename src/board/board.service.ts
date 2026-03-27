import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {

    private boards = [
        {
            id: 1,
            title: 'Board 1',
        },
        {
            id: 2,
            title: 'Board 2',
        },
        {
            id: 3,
            title: 'Board 3',
        },
    ];  
    getAllBoards() {
        return this.boards;
    }
}
