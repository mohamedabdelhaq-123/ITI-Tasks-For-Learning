import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // shorthand

  @Get() // decorator to make get request to this method
  getHello(): string {
    return this.appService.getHello();
  }
}

// the cycle:
// client
// req
// middleware
// routes resolver
// controller
// service
// db/api (do operation)
// service
// controller
// routes resolver
// res
// client
