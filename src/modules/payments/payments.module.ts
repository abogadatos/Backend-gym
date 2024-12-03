import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/database/entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsCustomRepository } from './payments.repository';
import { MembershipsModule } from '../memberships/memberships.module';
import { UsersModule } from '../users/users.module';
import { UsersCustomRepository } from '../users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    MembershipsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsCustomRepository, UsersCustomRepository],
  exports: [PaymentsCustomRepository],
})
export class PaymentsModule {}
