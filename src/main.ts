import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.HOST ?? '0.0.0.0';
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);

  await app.listen(port, host);
}

void bootstrap();
