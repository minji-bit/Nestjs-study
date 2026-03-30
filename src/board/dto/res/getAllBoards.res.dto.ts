class User{
    name: string;
}

export class GetAllBoardsResDto {
    id: string;
    title: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}