import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        console.log('validateUser----->', email);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        const { password: _, ...result } = user;
        console.log('result---->', result, user);
        return result;
    }

    async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: Partial<Users> }> {
        console.log('login------->', loginUserDto);
        const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        console.log('token------->', this.jwtService.sign(payload));
        return {
            token: this.jwtService.sign(payload),
            user,
        };
    }
}
