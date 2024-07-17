import { Module } from '@nestjs/common';

import { TasksModule } from '../tasks/tasks.module';
import { TaskProcessor } from './export.processor';

@Module({
  imports: [TasksModule],
  controllers: [],
  providers: [TaskProcessor],
  exports: [TaskProcessor],
})
export class ExportModule {}
