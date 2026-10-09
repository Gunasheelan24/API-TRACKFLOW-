import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../types/Task.type';

@Entity({ name: 'tasks' })
export class Tasks {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'title', length: 200 })
  title!: string;

  @Column({ name: 'description', length: 200 })
  description!: string;

  @Column({
    name: 'task_status',
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  taskStatus!: TaskStatus;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 100,
  })
  userId!: string;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt!: Date | null;
}
