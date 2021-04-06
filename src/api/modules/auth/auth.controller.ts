import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JWTGuard } from './jwt.guard';
import { LocalAuthenticationGuard } from './local-auth.guard';
import { LoginRequest, RefreshTokenRequest, RegisterRequest } from './request';
import RequestWithUser from './request-with-user.interface';
import { TokenService } from './token.service';

export interface AuthenticationPayload {
    user: User
    payload: {
      type: string
      token: string
      refresh_token?: string
    }
  }

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService, 
        private userService: UserService,
        private tokenService: TokenService
    ){}
    
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('/login')
    public async login(@Req() request: RequestWithUser, @Body() body: LoginRequest){
        //eturn this.authService.getAuthenticatedUser(loginData.email, loginData.password);
        const { email, password } = body
        const user = await this.userService.getByEmail(email);
    
        const token = await this.tokenService.generateAccessToken(user)
        const refresh = await this.tokenService.generateRefreshToken(user, 60 * 60 * 24 * 30)
    
        const payload = this.buildResponsePayload(user, token, refresh)
    
        return {
          status: 'success',
          data: payload,
        }        
        //return this.userService.getByEmail(request.user.email);
    }

    @Post('/register')
    public async createUser(@Body() registerDto: RegisterRequest){
        return await this.authService.register(registerDto);
    }

    @Post('/refresh-token')
    public async refresh (@Body() body: RefreshTokenRequest) {
      const { user, token } = await this.tokenService.createAccessTokenFromRefreshToken(body.refresh_token)
  
      const payload = this.buildResponsePayload(user, token)
  
      return {
        status: 'success',
        data: payload,
      }
    }  
    
    @Get('/me')
    @UseGuards(JWTGuard)
    public async getUser(@Req() request) {
      const userId = request.user.id
  
      const user = await this.userService.findOne(userId)
  
      return {
        status: 'success',
        data: user,
      }
    }    
    
    private buildResponsePayload (user: User, accessToken: string, refreshToken?: string): AuthenticationPayload {
        return {
          user: user,
          payload: {
            type: 'bearer',
            token: accessToken,
            ...(refreshToken ? { refresh_token: refreshToken } : {}),
          }
        }
    }    
}
