import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    password: string;
}
