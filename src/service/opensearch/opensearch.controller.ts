import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

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

  @ApiOperation({ summary: 'MySQL 상품 데이터를 OpenSearch 인덱스로 bulk 적재' })
  @ApiParam({
    name: 'index',
    description: '적재할 OpenSearch 인덱스 이름',
    example: 'products',
  })
  @Post('bulk/:index')
  bulk(@Param('index') index: string) {
    return this.opensearchService.bulk(index);
  }
}
