import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { LoginUserDto, RegisterUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService
  ) { }

  async createUser(registerUserDto: RegisterUserDto): Promise<Users> {
    const { name, email, password, phone, role } = registerUserDto;

    try {      
      const existingUser = await this.userRepository.findOne({
        where: [{ email }],
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        name,        
        email,
        password: hashedPassword,
        phone,
        role,
      });
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.code === '409') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error.message || 'Something went wrong while creating user');
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ message: string; token: string; user: Partial<Users> }> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload = { userId: user.id, email: user.email, role: user.role };
      const jwtSecret = process.env.JWT_SECRET;      
  
      const token = this.jwtService.sign(payload, { secret: jwtSecret });
  
      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,          
          phone: user.phone,
          role: user.role,
          createdat: user.createdat,
        },
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

}