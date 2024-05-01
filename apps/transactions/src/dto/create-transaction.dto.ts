import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty()
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty()
  @IsNumber()
  tranferTypeId: number;

  @ApiProperty()
  @IsNumber()
  value: number;
}
