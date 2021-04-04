import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from './request';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

const BASE_OPTIONS: SignOptions = {
    issuer: 'https://my-app.com',
    audience:'https://my-app.com',
}

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService, 
        private readonly jwt: JwtService
    ) {}
     
    public async register(userData: RegisterRequest) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        try {
            const createdUser = await this.userService.create({
                ...userData,
                password: hashedPassword
            });

            return createdUser;
            
        } catch (error) {
            //console.log(error);
            if (error?.errno === 1062) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 
    
    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        //console.log(email, plainTextPassword);
        try {
            const user = await this.userService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
              return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    } 
    
    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
          throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
        }
    }   
}
