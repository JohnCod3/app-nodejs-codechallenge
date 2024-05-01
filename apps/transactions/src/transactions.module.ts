import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmConfig } from './config/db.config';
import { KafkaClientConfig } from './config/kafka.config';
import { throttleConfig } from './config/throttle.config';
import { TransactionExternal } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    TypeOrmModule.forFeature([TransactionExternal]),
    ClientsModule.register([KafkaClientConfig]),
    ThrottlerModule.forRoot(throttleConfig),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class TransactionsModule {}
