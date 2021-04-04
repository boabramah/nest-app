import { Injectable } from '@nestjs/common';
import { Connection, EntityRepository, Repository } from 'typeorm'
import { RefreshToken } from './refresh-token.entity';
import { User } from './user.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken>{

    public async createRefreshToken (user: User, ttl: number): Promise<RefreshToken> {
        const token = new RefreshToken()

        token.userId = user.id
        token.isRevoked = false
        
        const expiration = new Date()
        expiration.setTime(expiration.getTime() + ttl)
        
        token.expires = expiration

        await this.save(token);

        return token;
    }
    
    public async findTokenById (id: number): Promise<RefreshToken | null> {
        return this.findOne({id});
    }

}

export const RefreshTokenRepositoryProvider = {
    provide: 'RefreshTokenRepository',
    useFactory: (connection: Connection) => connection.getCustomRepository(RefreshTokenRepository),
    inject: [Connection],
  };