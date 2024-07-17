import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions } from '@nestjs/common';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const port = configService.get<number>('APP_PORT', { infer: true });
  const nodeEnv = configService.get<string>('NODE_ENV');

  const app = await NestFactory.create(AppModule, {
    logger: nodeEnv !== 'development' ? ['error'] : true,
  } as NestApplicationOptions);

  await app.listen(port, () => console.log(`[+] http://localhost:${port}`));
}

bootstrap();
