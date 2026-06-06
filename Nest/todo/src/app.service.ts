import { Injectable } from '@nestjs/common';

@Injectable() // decorator to decorate appservice class to be used in other modules
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
