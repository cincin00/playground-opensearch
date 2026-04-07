import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpensearchModule as NestjsOpensearchModule } from 'nestjs-opensearch';

import { ConfigureModule } from '../config/config.module';
import { OpensearchController } from './opensearch.controller';
import { OpensearchService } from './opensearch.service';

/**
 * OpenSearch 모듈 연동 설정
 * - useFactory 를 사용하여 동기 설정 방식으로 OpenSearch 클라이언트 설정
 * @link https://github.com/neoatlan/nestjs-opensearch?tab=readme-ov-file#module-configuration
 */
@Module({
  imports: [
    NestjsOpensearchModule.forRootAsync({
      imports: [ConfigureModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node:
          configService.get<string>('OPENSEARCH_NODE') ??
          'http://localhost:9200',
      }),
    }),
  ],
  providers: [OpensearchService],
  controllers: [OpensearchController],
})
export class OpensearchModule {}
