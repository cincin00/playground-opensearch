import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.HOST ?? '0.0.0.0';
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Playground OpenSearch API')
    .setDescription('실습용 NestJS API 문서')
    .setVersion('0.1.0')
    .addTag('status')
    .build();
  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocumentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
    customSiteTitle: 'Playground OpenSearch Swagger',
  });

  await app.listen(port, host);
}

void bootstrap();
