import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
  @IsNotEmpty({ message: 'An email is required' })
  @IsEmail()
  @ApiProperty()
  readonly email: string

  @IsNotEmpty({ message: 'A password is required to login' })
  @ApiProperty()
  readonly password: string
}

export class RegisterRequest {

  @IsString()
  @IsNotEmpty({ message: 'Firstname is required' })
  @MaxLength(20)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Lastname is required' })
  @MaxLength(20)
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  email: string; 

  @IsNotEmpty({ message: 'A password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @ApiProperty()
  readonly password: string;  
}

export class RefreshTokenRequest {
  @IsNotEmpty({ message: 'The refresh token is required' })
  @ApiProperty()
  readonly refresh_token: string
}