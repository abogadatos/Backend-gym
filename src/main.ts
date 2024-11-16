import { LoggerMiddleware } from './middlewares/UsersLogger.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerMiddlewre = new LoggerMiddleware();

  app.use(loggerMiddlewre.use);

  app.useGlobalFilters(new ValidationExceptionFilter());

  await app.listen(3000);
  console.log('Listening on port 3000');
}
bootstrap();
