import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsCustomRepository } from './reviews.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from 'src/database/entities/reviews.entity';
import { UsersModule } from '../users/users.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reviews]),
    UsersModule,
    ClassesModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsCustomRepository],
  exports: [],
})
export class ReviewsModule {}
