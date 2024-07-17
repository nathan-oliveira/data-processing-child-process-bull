import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from './entities/task.entity';
import { TaskService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [],
  providers: [TaskService],
  exports: [TaskService],
})
export class TasksModule {}
