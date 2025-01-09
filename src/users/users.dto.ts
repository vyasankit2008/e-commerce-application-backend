import { IsEmail, IsString, IsNotEmpty, MinLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.enum';

export class RegisterUserDto {
    @ApiProperty({example: 'jack roy'})
    @IsString()
    @IsNotEmpty({ message: "Please enter your name." })
    name: string;
    
    @ApiProperty({example: 'jackroy@gmail.com'})
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: "Please enter your email." })
    email: string;

    @ApiProperty({ example: 'xyzuser' })
    @IsString()    
    @IsNotEmpty({ message: "Please enter your username." })
    username: string;

    @ApiProperty()
    @IsString()    
    @IsNotEmpty({message:"Please enter your phone number."})    
    phone: string;    

    @ApiProperty({example: 'lg5o7C%Bz]fH0Rj'})
    @IsString()
    @IsNotEmpty({ message: "Please enter your password." })
    @MinLength(7)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;  
    
    @ApiProperty({ example: 'admin/user' })
    @IsEnum(Role)    
    @IsNotEmpty({ message: "Please enter your role." })
    role: Role;
}

export class LoginUserDto {    
    @ApiProperty({example: 'xyz@gmail.com'})
    @IsEmail()
    @IsNotEmpty({message:"Please enter your email address."}) 
    email: string;

    @ApiProperty({example: 'lg5o7C%Bz]fH0Rj'})
    @IsString()
    @IsNotEmpty({message:"Please enter your password."})
    @MinLength(7)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}