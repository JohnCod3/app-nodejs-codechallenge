import { IsNumber, IsUUID } from 'class-validator';

export class AntiFraudValidatorDto {
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  value: number;
}
