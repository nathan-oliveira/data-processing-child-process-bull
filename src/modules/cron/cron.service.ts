import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// import { join } from 'path';

import { TaskService } from 'src/modules/tasks/tasks.service';
// import { TaskEntity, TaskStatus } from 'src/modules/tasks/entities/task.entity';
// import { ClusterProcess } from 'src/common/process/cluster-process';
import { ConnectionConfig } from 'src/config/connection.config';
import { setTimeout } from 'timers/promises';

@Injectable()
export class CronService {
  constructor(
    private readonly taskService: TaskService,
    @InjectQueue('taskQueue') private readonly taskQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.taskQueue.clean(0, 'completed');
    await this.taskQueue.clean(0, 'wait');
    await this.taskQueue.clean(0, 'active');
    await this.taskQueue.clean(0, 'delayed');
    await this.taskQueue.clean(0, 'failed');
  }

  @Cron('*/10 * * * * *')
  async schedulerTasks() {
    const tasks = await this.taskService.getPendingTasks(new Date());
    console.log(tasks);
    for (const task of tasks) {
      await this.taskQueue.add(task);
    }
  }

  static async *getAllPagedData(itemsPerPage, page = 0) {
    const mongoDB = await ConnectionConfig.getMongoDBConnection(
      'school',
      'students',
    );

    const data = mongoDB.collection.find().skip(page).limit(itemsPerPage);
    const items = await data.toArray();
    if (!items.length) {
      // if (mongoDB) await mongoDB.client.close(true);
      return;
    }

    // if (mongoDB) await mongoDB.client.close(true);

    yield items;

    // se for utilizar valor maximo padrão 100 de conexão do postgresql, usar o timeout
    await setTimeout(100);

    yield* CronService.getAllPagedData(itemsPerPage, (page += itemsPerPage));
  }
}
