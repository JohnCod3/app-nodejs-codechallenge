import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaClientConfig } from './config/kafka.config';

@Module({
  imports: [ClientsModule.register([KafkaClientConfig])],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
