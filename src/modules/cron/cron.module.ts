import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CronService } from './cron.service';
import { TasksModule } from '../tasks/tasks.module';
import { ExportModule } from '../export/export.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT', { infer: true }),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    ExportModule,
  ],
  controllers: [],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
