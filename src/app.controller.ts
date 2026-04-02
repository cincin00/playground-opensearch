import { Controller, Get } from '@nestjs/common';

import { AppService, type ServiceStatus } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): ServiceStatus {
    return this.appService.getStatus();
  }

  @Get('health')
  getHealth(): ServiceStatus {
    return this.appService.getStatus();
  }
}
