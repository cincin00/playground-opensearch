import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { ServiceStatusDto } from './dto/service-status.dto';

@ApiTags('status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '루트 상태 확인' })
  @ApiOkResponse({
    description: '서비스 상태 정보를 반환합니다.',
    type: ServiceStatusDto,
  })
  @Get()
  getRoot(): ServiceStatusDto {
    return this.appService.getStatus();
  }

  @ApiOperation({ summary: '헬스 체크' })
  @ApiOkResponse({
    description: '서비스 상태 정보를 반환합니다.',
    type: ServiceStatusDto,
  })
  @Get('health')
  getHealth(): ServiceStatusDto {
    return this.appService.getStatus();
  }
}
