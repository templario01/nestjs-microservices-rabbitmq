import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  readonly name: string;

  @Prop()
  readonly price: number;

  @Prop()
  readonly phoneNumber: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
