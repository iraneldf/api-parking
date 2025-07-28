import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({
    required: true,
    enum: ['reserva', 'cancelacion', 'entrada', 'salida'],
  })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  userId?: number;

  @Prop({ type: Object })
  data?: Record<string, any>;
}

export const LogSchema = SchemaFactory.createForClass(Log);
