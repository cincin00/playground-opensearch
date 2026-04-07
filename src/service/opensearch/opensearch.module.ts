import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpensearchModule as NestjsOpensearchModule } from 'nestjs-opensearch';

import { ConfigureModule } from '../config/config.module';
import { OpensearchService } from './opensearch.service';
import { OpensearchController } from './opensearch.controller';

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
