import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth.guard'; 
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

        if (!roles) {
            return true;  // If no roles are specified, proceed without checking
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;  // The user should have been added to the request by JwtAuthGuard

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Check if the user has one of the required roles
        if (!roles.includes(user.role)) {
            throw new UnauthorizedException('Forbidden');
        }

        return true;
    }
}