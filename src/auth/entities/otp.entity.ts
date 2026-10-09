import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_otp' })
export class UserOtp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'otp',
    type: 'varchar',
    nullable: false,
  })
  otp!: string;

  @Column({
    name: 'expiry_at',
    type: 'datetime',
  })
  expiryAt!: Date;

  @Column({
    type: 'varchar',
    name: 'user_id',
    length: 100,
  })
  userId!: string;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt!: Date | null;
}
