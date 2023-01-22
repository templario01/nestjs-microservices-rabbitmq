import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: string;
}
