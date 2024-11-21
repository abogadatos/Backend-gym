import {  Body, Controller, Get, Post,  } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/createmermership.dto';


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

    @Post("create-product")
  async createMembership(@Body() createMembershipDto: CreateMembershipDto) {
    return await this.membershipsService.createMembershipWithStripe(createMembershipDto);
  }
}

