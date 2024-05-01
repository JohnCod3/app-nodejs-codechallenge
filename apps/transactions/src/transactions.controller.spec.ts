import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmConfig } from './config/db.config';
import { KafkaClientConfig } from './config/kafka.config';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  TransactionExternal,
  TransactionStatus,
} from './entities/transaction.entity';

describe(TransactionsController.name, () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfig,
        }),
        TypeOrmModule.forFeature([TransactionExternal]),
        ClientsModule.register([KafkaClientConfig]),
      ],
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    transactionsController = app.get<TransactionsController>(
      TransactionsController,
    );

    transactionsService = app.get<TransactionsService>(TransactionsService);
  });

  describe('Create a transaction', () => {
    it('should return the new transaction', async () => {
      const payload: CreateTransactionDto = {
        accountExternalIdCredit: randomUUID(),
        accountExternalIdDebit: randomUUID(),
        tranferTypeId: 1,
        value: 950,
      };

      const transaction: TransactionExternal = {
        ...payload,
        transactionExternalId: randomUUID(),
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
      };

      jest
        .spyOn(transactionsService, 'createTransaction')
        .mockImplementation(async () => transaction);

      expect(await transactionsController.createTransaction(payload)).toBe(
        transaction,
      );
    });

    it('should throw an error when a parameter is invalid', async () => {
      const payload: CreateTransactionDto = {
        accountExternalIdCredit: '',
        accountExternalIdDebit: randomUUID(),
        tranferTypeId: 1,
        value: 950,
      };

      const error = 'invalid input syntax for type uuid: ""';

      try {
        await transactionsController.createTransaction(payload);
      } catch (err) {
        expect(err.message).toBe(error);
      }
    });

    it('should throw an error when some fails', async () => {
      const payload: CreateTransactionDto = {
        accountExternalIdCredit: randomUUID(),
        accountExternalIdDebit: randomUUID(),
        tranferTypeId: 1,
        value: 950,
      };

      const error = 'An error occurred while creating transaction';

      jest
        .spyOn(transactionsService, 'createTransaction')
        .mockRejectedValue(new Error(error));

      try {
        await transactionsController.createTransaction(payload);
      } catch (err) {
        expect(err.message).toBe(error);
      }
    });
  });
});
