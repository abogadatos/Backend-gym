import { Controller,Delete,Param,Put,Body} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

import { UpdateClassScheduleDto } from './dto/updateSchedule.dto';

@Controller('schedule')
export class ScheduleController {

    constructor(
       private readonly scheduleService:ScheduleService,
    ){}

    @Put(':id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateClassScheduleDto, 
  ){

    return this.scheduleService.updateSchedule(id, updateScheduleDto);
  }


    @Delete(':id')
async deleteSchedule(@Param('id') scheduleId: string) {
  await this.scheduleService.deleteSchedule(scheduleId);
}

}
