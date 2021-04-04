import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) {} 
    
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    
    findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    } 

    public async getByEmail(email: string) {
        const user = await this.userRepository.findOne({ email });
        if (user) {
          return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }      
    
    public async create(userDto: CreateUserDto): Promise<User> {
        try {
          return await this.userRepository.createUser(userDto);
        } catch (err) {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }    
}
