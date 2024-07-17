import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';

import { TaskEntity, TaskStatus, TaskType } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getPendingTasks(currentTime: Date): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      where: {
        status: TaskStatus.PENDING,
        scheduled_at: LessThanOrEqual(currentTime),
      },
    });
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await this.taskRepository.update(taskId, { status });
  }

  async createTask(type: TaskType, scheduledAt: Date): Promise<TaskEntity> {
    const newTask = this.taskRepository.create({
      type,
      status: TaskStatus.PENDING,
      scheduled_at: scheduledAt,
    });

    return this.taskRepository.save(newTask);
  }
}
