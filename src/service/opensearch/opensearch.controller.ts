import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { OpensearchService } from './opensearch.service';

@Controller('opensearch')
export class OpensearchController {
  constructor(private readonly opensearchService: OpensearchService) {}

  @ApiOperation({ summary: 'OpenSearch 클러스터 정보 조회' })
  @Get()
  getInfo() {
    return this.opensearchService.getInfo();
  }

  @ApiOperation({ summary: 'OpenSearch 클러스터 상태 조회' })
  @Get('health')
  getHealth() {
    return this.opensearchService.getHealth();
  }
}
