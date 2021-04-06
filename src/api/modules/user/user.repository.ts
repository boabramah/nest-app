import { Repository, EntityRepository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {  

    public async createUser(userDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.email = userDto.email;
        user.password = userDto.password;

        await this.save(user);

        return user;
    }

}

