import { LoggerMiddleware } from './middlewares/UsersLogger.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersService } from './modules/users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerMiddlewre = new LoggerMiddleware();
  app.use(loggerMiddlewre.use);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Proyecto JustDoIt')
    .setDescription('Proyecto dearrollado con NestJS')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const seederService = app.get(UsersService);
  console.log('Starting the database seeding process...');
  try {
    await seederService.seedDatabase();
    console.info(`
        Database seeding completed
          ✅✅✅✅✅✅✅✅✅✅
      `);
  } catch (err) {
    console.error('Error during database seeding:', err);
  }

  await app.listen(process.env.APP_PORT);
  console.log(`Listening on port ${process.env.APP_PORT}`);
}
bootstrap();
