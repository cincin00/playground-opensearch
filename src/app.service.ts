import { Injectable } from '@nestjs/common';

export interface ServiceStatus {
  service: string;
  status: 'ok';
  timestamp: string;
}

@Injectable()
export class AppService {
  getStatus(): ServiceStatus {
    return {
      service: 'playground-opensearch',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
