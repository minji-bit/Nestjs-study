import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserReqDto } from './dto/createUser.req.dto';
import { UpdateUserReqDto } from './dto/updateUser.req.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('')
    createUser(@Body() dto: CreateUserReqDto){
        return this.userService.createUser(dto);
    }

    @Get()
    getUser(){
        return this.userService.getUser();
    }

    @Get('/:userid')
    getUserById(@Param('userid') userid: string){
        return this.userService.getUserDetail(userid);
    }

    @Patch()
    updateUser(@Body() dto: UpdateUserReqDto){
        return this.userService.updateUser(dto);
    }


}
