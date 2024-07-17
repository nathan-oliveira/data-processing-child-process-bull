import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { join } from 'path';

import { TaskEntity, TaskStatus } from 'src/modules/tasks/entities/task.entity';
import { TaskService } from 'src/modules/tasks/tasks.service';
import { ClusterProcess } from 'src/common/process/cluster-process';
import { ConnectionConfig } from 'src/config/connection.config';
import { CronService } from '../cron/cron.service';

@Processor('taskQueue')
export class TaskProcessor {
  constructor(private readonly taskService: TaskService) {}

  @Process()
  async handleTask(job: Job<TaskEntity>) {
    const task = job.data;
    const type = task.type.toLowerCase();
    const TASK_FILE = join(__dirname, `${type}-background.js`);

    const CLUSTER_SIZE = 25;
    const ITEMS_PER_PAGE = 1000;
    let totalProcessed = 0;

    const mongoDB = await ConnectionConfig.getMongoDBConnection(
      'school',
      'students',
    );
    const total = await mongoDB.collection.countDocuments();

    const conn = await ConnectionConfig.getPostgresConnection('librarys');

    const cp = new ClusterProcess(
      TASK_FILE,
      CLUSTER_SIZE,
      async (message) => {
        if (++totalProcessed !== total) return;
        cp.killAll();

        const { qtd: insertedOnSQLite } = await conn.client.query(
          'select count(*) as qtd from librarys.students',
        );

        console.log(
          `total on MongoDB ${total} and total on Postgres ${insertedOnSQLite}`,
        );
        console.log(
          `are the same? ${total === insertedOnSQLite ? 'yes' : 'no'}`,
        );

        await job.remove();
        await this.taskService.updateTaskStatus(task.id, TaskStatus.COMPLETED);

        process.exit();
      },
      async (error) => {
        console.log('cp => ', error);
        await this.taskService.updateTaskStatus(task.id, TaskStatus.FAILED);
        process.exit();
      },
    );

    await this.taskService.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);

    for await (const data of CronService.getAllPagedData(ITEMS_PER_PAGE)) {
      cp.sendToChild(data);
    }
  }
}
