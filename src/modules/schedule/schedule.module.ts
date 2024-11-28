import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ClassSchedule } from 'src/database/entities/ClassSchedule.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule])], // Importa el repositorio de ClassSchedule
  providers: [ScheduleService], // Registra el servicio
  controllers: [], // Agrega el controlador
  exports: [ScheduleService], // Exporta el servicio para su uso en otros módulos
})
export class ScheduleModule {}
