import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { configureCloudinary } from '../../database/config/cloudinary';
import { Routine } from 'src/database/entities/routines.entity';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
  controllers: [RoutinesController],
  providers: [
    RoutinesService,
    CloudinaryService,
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: (configService: ConfigService) => configureCloudinary(configService),
      inject: [ConfigService],
    },
  ],
})
export class RoutinesModule {}
