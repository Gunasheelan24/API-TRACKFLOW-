import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tasks } from '../../tasks/entities/task.entity';

@Entity('time_logs')
export class TimeLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  taskId!: string;

  @ManyToOne(() => Tasks, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'taskId' })
  task!: Tasks;

  @Column({ type: 'datetime', precision: 3 })
  startedAt!: Date;

  @Column({
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  endedAt!: Date | null;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  durationInSeconds!: number;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @DeleteDateColumn({
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  deleted_at!: Date | null;
}
