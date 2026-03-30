class User{
    name: string;
}

export class GetBoardDetailResDto {
    id: string;
    title: string;
    body: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}