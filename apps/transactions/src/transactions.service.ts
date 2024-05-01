import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KAFKA_TOPICS } from './transactions.consts';
import { AntiFraudValidatorDto } from './dto/anti-fraud-validator.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionExternal } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ANTI_FRAUD') private readonly antifraudClient: ClientKafka,
    @InjectRepository(TransactionExternal)
    private readonly transactionExternalRepository: Repository<TransactionExternal>,
  ) {}

  async getTransaction(transactionExternalId: string) {
    try {
      const transaction = await this.transactionExternalRepository.findOne({
        where: { transactionExternalId },
      });

      return {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
          name: '',
        },
        transactionStatus: {
          name: transaction.status,
        },
        value: transaction.value,
        createdAt: transaction.createdAt,
      };
    } catch (err) {
      throw new NotFoundException("The transaction wasn't found");
    }
  }

  async createTransaction(payload: CreateTransactionDto) {
    try {
      const transaction = this.transactionExternalRepository.create(payload);
      const response =
        await this.transactionExternalRepository.save(transaction);

      this.antifraudClient.emit(
        KAFKA_TOPICS.ANTI_FRAUD.UNPROCESSED,
        JSON.stringify({
          transactionExternalId: response.transactionExternalId,
          value: response.value,
        }),
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async antifraudValidation({
    transactionExternalId,
    status,
  }: AntiFraudValidatorDto) {
    await this.transactionExternalRepository.update(
      { transactionExternalId },
      { status },
    );
  }
}
