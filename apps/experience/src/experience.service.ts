import { Injectable } from '@nestjs/common';

@Injectable()
export class ExperienceService {
  getHello(): string {
    return 'Hello World!';
  }
}
