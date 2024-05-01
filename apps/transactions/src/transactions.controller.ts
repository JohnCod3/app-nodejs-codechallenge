import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { KAFKA_TOPICS } from './transactions.consts';
import { TransactionsService } from './transactions.service';
import { AntiFraudValidatorDto } from './dto/anti-fraud-validator.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':transactionExternalId')
  getTransaction(@Param() { transactionExternalId }: GetTransactionDto) {
    return this.transactionsService.getTransaction(transactionExternalId);
  }

  @Post()
  createTransaction(@Body() payload: CreateTransactionDto) {
    return this.transactionsService.createTransaction(payload);
  }

  @SkipThrottle()
  @EventPattern(KAFKA_TOPICS.ANTI_FRAUD.PROCESSED)
  antifraudResponse(@Payload() message: AntiFraudValidatorDto) {
    this.transactionsService.antifraudValidation(message);
  }
}
