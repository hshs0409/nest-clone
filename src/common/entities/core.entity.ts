import { Field } from '@nestjs/graphql';
import {
  Check,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(type => Date)
  updatedAt: Date;
}
