import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  public constructor (private userService: UserService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '1234567890',
      signOptions: {
        expiresIn: '5m',
      },
    });
  }

  async validate (payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload
    const user = await this.userService.findOne(id.toString());
    if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
    }
    return user
  }
}