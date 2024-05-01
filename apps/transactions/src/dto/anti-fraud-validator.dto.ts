import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

import { TransactionStatus } from '../entities/transaction.entity';

export class AntiFraudValidatorDto {
  @ApiProperty()
  @IsUUID()
  transactionExternalId: string;

  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
