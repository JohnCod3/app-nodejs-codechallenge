import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_TOPICS } from './anti-fraud.consts';
import { AntiFraudValidatorDto } from './dto/anti-fraud-validator.dto';

enum TransactionStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('ANTI_FRAUD') private readonly antifraudClient: ClientKafka,
  ) {}

  validator(message: AntiFraudValidatorDto) {
    const payload = {
      transactionExternalId: message.transactionExternalId,
      status:
        message.value > 1000
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED,
    };

    this.antifraudClient.emit(
      KAFKA_TOPICS.ANTI_FRAUD.PROCESSED,
      JSON.stringify(payload),
    );
  }
}
