import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './service/database/dabase.module';
import { OpensearchModule } from './service/opensearch/opensearch.module';
import { ProductModule } from './service/product/product.module';
import { SearchModule } from './service/search/search.module';

@Module({
  imports: [DatabaseModule, ProductModule, OpensearchModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
