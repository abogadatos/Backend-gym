import { Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { MembershipsCustomRepository } from './memberships.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memberships } from 'src/database/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Memberships])],
  controllers: [MembershipsController],
  providers: [MembershipsCustomRepository, MembershipsService],
  exports: [MembershipsCustomRepository, TypeOrmModule],
})
export class MembershipsModule {}
