import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './database/config/typeorm';
import { AttendanceModule } from './modules/attendances/attendance.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookedClassesModule } from './modules/booked_classes/booked_classes.module';
import { ClassesModule } from './modules/classes/classes.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './modules/email/email.service';
import { EmailModule } from './modules/email/email.module';
import { ScheduleService } from './modules/schedule/schedule.service';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { RoutinesModule } from './modules/routines/routines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AttendanceModule,
    AuthModule,
    BookedClassesModule,
    ClassesModule,
    MembershipsModule,
    PaymentsModule,
    ProductsModule,
    ReviewsModule,
    TrainersModule,
    UsersModule,
    EmailModule,
    ScheduleModule,
    RoutinesModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, ScheduleService],
  exports: [],
})
export class AppModule {}
