import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetTransactionDto {
  @ApiProperty()
  @IsUUID()
  transactionExternalId: string;
}
