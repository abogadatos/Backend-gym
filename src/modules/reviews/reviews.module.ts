import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from 'src/database/entities/reviews.entity';
import { UsersModule } from '../users/users.module';
import { ClassesModule } from '../classes/classes.module';
import { forwardRef } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Classes } from 'src/database/entities/classes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reviews, User, Classes]),
    ClassesModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
