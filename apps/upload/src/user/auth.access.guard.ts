
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      response.status(200).json({
        statusCode: 401,
        message: "Unauthorized"
      })
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env['JWT_USER_ACCESS_SECRET']
        }
      );

      if (payload.type == 'ACCESS' && (payload.user)) request['user'] = payload;
      else {
        response.status(200).json({
          statusCode: 401,
          message: "Unauthorized"
        })
        return false;
      }

    } catch (error) {

      response.status(200).json({
        statusCode: 401,
        message: "Unauthorized"
      })
      return false;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
