import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpensearchModule } from './opensearch/opensearch.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ProductModule, OpensearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
