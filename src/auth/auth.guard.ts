import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add any additional logic for route protection         
    // const request = context.switchToHttp().getRequest();
    // console.log(request); // Logs the incoming HTTP request
    return super.canActivate(context);
  }
}