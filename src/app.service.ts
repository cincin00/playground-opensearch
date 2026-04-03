import { Injectable } from '@nestjs/common';

import { ServiceStatusDto } from './dto/service-status.dto';

@Injectable()
export class AppService {
  getStatus(): ServiceStatusDto {
    return {
      service: 'playground-opensearch',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
