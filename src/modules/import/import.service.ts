import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportService {
  async handleTask(taskId: number): Promise<void> {
    // Lógica de importação aqui
    console.log(`Handling import task ${taskId}`);
    // Simula uma operação assíncrona
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Import task ${taskId} completed`);
  }
}
