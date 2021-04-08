import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') { 

  handleRequest (err:any, user:any, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new HttpException('Session expired please login', HttpStatus.BAD_REQUEST);
    }
    if(info && info?.name == 'Error'){
      throw new HttpException(info.message, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

}