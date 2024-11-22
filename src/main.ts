import { LoggerMiddleware } from './middlewares/UsersLogger.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerMiddlewre = new LoggerMiddleware();

  app.use(loggerMiddlewre.use);

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.APP_PORT);
  console.log(`Listening on port ${process.env.APP_PORT}`);
}
bootstrap();
