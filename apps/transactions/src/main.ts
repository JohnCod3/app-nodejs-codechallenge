import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { TransactionsModule } from './transactions.module';
import { KafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  app.connectMicroservice(KafkaConfig);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('App Node.js codechallenge')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
