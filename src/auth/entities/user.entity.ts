import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  full_name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  password!: string;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at!: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;
}
