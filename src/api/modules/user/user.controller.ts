import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JWTGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    @UseGuards(JWTGuard)
    getUsers(){
        return this.userService.findAll();
    }
}
