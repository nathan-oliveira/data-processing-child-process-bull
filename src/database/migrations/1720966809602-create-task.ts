import { Table, MigrationInterface, QueryRunner } from 'typeorm';

import { TaskType, TaskStatus } from 'src/modules/tasks/entities/task.entity';

export class CreateTask1720966809602 implements MigrationInterface {
  private table = new Table({
    name: 'tasks',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'name',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'type',
        type: 'enum',
        enum: Object.values(TaskType),
        isNullable: false,
      },
      {
        name: 'status',
        type: 'enum',
        enum: Object.values(TaskStatus),
        isNullable: false,
      },
      {
        name: 'scheduled_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'active',
        type: 'boolean',
        default: true,
        isNullable: false,
      },
      {
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'removedAt',
        type: 'timestamp',
        isNullable: true,
        default: null,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
