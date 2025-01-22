import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { RegisterUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,    
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

  async findByEmail(email: string): Promise<Users | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

}