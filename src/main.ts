import { LoggerMiddleware } from './middlewares/UsersLogger.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerMiddlewre = new LoggerMiddleware();
  app.use(loggerMiddlewre.use);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  //   const swaggerConfig = new DocumentBuilder()
  //     .setTitle('ecommerce - nechodev API')
  //     .setDescription(
  //       'Ecommerce demo with NestJS for SoyHenry Bootcamp Module 4 project',
  //     )
  //     .setVersion('1.0')
  //     .addBearerAuth()
  //     .build();

  //   const document = SwaggerModule.createDocument(app, swaggerConfig);
  //   SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT);
  console.log(`Listening on port ${process.env.APP_PORT}`);
}
bootstrap();
