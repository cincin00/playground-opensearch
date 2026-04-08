import { Module } from '@nestjs/common';

import { OpensearchModule } from '../opensearch/opensearch.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [OpensearchModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
