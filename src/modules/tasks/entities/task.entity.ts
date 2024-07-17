import { Entity, Column } from 'typeorm';

import BaseEntity from 'src/common/base/base.entity';

export enum TaskType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'timestamp' })
  scheduled_at: Date;
}
