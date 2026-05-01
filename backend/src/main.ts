import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  Logger.log(`Backend running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start backend', error instanceof Error ? error.stack : undefined);
});
