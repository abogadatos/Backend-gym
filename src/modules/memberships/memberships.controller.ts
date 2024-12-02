import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/createMermership.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('seeder')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async addMemberships() {
    return await this.membershipsService.addMemberships();
  }

  @Get()
  @ApiBearerAuth()
  async getAllMemberships() {
    return await this.membershipsService.allMemberships();
  }

  @Post('create-product')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async createMembership(@Body() createMembershipDto: CreateMembershipDto) {
    return await this.membershipsService.createMembershipWithStripe(
      createMembershipDto,
    );
  }
}
