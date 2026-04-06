import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './service/database/dabase.module';
import { OpensearchModule } from './service/opensearch/opensearch.module';
import { ProductModule } from './service/product/product.module';

@Module({
  imports: [DatabaseModule, ProductModule, OpensearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
