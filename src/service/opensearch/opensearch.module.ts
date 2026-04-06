import { Module } from '@nestjs/common';

import { OpensearchService } from './opensearch.service';
import { OpensearchController } from './opensearch.controller';

@Module({
  providers: [OpensearchService],
  controllers: [OpensearchController],
})
export class OpensearchModule {}
