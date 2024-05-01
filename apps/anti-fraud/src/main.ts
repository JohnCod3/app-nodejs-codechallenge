import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { AntiFraudModule } from './anti-fraud.module';
import { KafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    KafkaConfig,
  );

  await app.listen();
}

bootstrap();
