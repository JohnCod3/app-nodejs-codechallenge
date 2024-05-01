import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { KAFKA_TOPICS } from './anti-fraud.consts';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudValidatorDto } from './dto/anti-fraud-validator.dto';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(KAFKA_TOPICS.ANTI_FRAUD.UNPROCESSED)
  antifraudValidator(@Payload(ValidationPipe) message: AntiFraudValidatorDto) {
    this.antiFraudService.validator(message);
  }
}
