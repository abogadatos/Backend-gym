import { Controller, Get } from '@nestjs/common';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
    constructor (private readonly membershipsService:MembershipsService){}
   
    @Get("seeder")
        async addMemberships(){
            return await this.membershipsService.addMemberships();
        }

    @Get()
    async getAllMemberships(){
        return await this.membershipsService.allMemberships();
    }
    
}
