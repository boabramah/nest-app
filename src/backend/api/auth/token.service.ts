// app/modules/authentication/tokens.service.ts

import { UnprocessableEntityException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from '../user/refresh-token.entity';
import { RefreshTokenRepository } from '../user/refresh-token.repository';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';


const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience:'https://my-app.com',
}

export interface RefreshTokenPayload {
  jti: number;
  sub: number
}

@Injectable()
export class TokenService {
  private readonly tokenRepository: RefreshTokenRepository;
  private readonly userService: UserService;
  private readonly jwt: JwtService;

  public constructor (tokenRepository: RefreshTokenRepository, userService: UserService, jwt: JwtService) {
    this.tokenRepository = tokenRepository;
    this.userService = userService;
    this.jwt = jwt;
  }

  public async generateAccessToken (user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    }

    return this.jwt.signAsync({}, opts)
  }

  public async generateRefreshToken (user: User, expiresIn: number): Promise<string> {
    const token = await this.tokenRepository.createRefreshToken(user, expiresIn)

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
      jwtid: String(token.id),
    }

    return this.jwt.signAsync({}, opts)
  }

  public async resolveRefreshToken (encoded: string): Promise<{ user: User, token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded)
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload)

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token }
  }

  public async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: User }> {
    const { user } = await this.resolveRefreshToken(refresh)

    const token = await this.generateAccessToken(user)

    return { user, token }
  }
  
  private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwt.verifyAsync(token)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired')
      } else {
        throw new UnprocessableEntityException('Refresh token malformed') 
      }
    }
  }

  private async getUserFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<User> {
    const subId = payload.sub

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.userService.findOne(subId.toString());
  }

  private async getStoredTokenFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<RefreshToken | null> {
    const tokenId = payload.jti

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.tokenRepository.findTokenById(tokenId)
  }
}
