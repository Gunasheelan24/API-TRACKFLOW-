import { FindOperator } from 'typeorm';

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface WhereType {
  userId: string;
  deletedAt: FindOperator<any>;
  taskStatus?: TaskStatus;
}
