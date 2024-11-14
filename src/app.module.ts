import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PaymentsController } from './modules/payments/payments.controller';
import { AttendanceController } from './modules/attendance/attendance.controller';
import { PaymentsService } from './modules/payments/payments.service';
import { AttendanceService } from './modules/attendance/attendance.service';
import { BookedClassesController } from './modules/booked_classes/booked_classes.controller';
import { BookedClassesService } from './modules/booked_classes/booked_classes.service';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule,ReviewsModule],
  controllers: [PaymentsController, AttendanceController, BookedClassesController],
  providers: [PaymentsService, AttendanceService, BookedClassesService]
})

export class AppModule {}
