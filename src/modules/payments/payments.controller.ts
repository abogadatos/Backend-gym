import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('seeder')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async addMemberships() {
    return await this.paymentsService.addMemberships();
  }

  @Post('create-customer')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.paymentsService.createCustomer(createCustomerDto);
  }

  @Get('success')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async paymentSuccess(@Query('session_id') sessionId: string) {
    return this.paymentsService.handlePaymentSuccess(sessionId);
  }

  @Get('check-payment-status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async checkPaymentStatus(@Query('session_id') sessionId: string) {
    return this.paymentsService.checkPaymentStatus(sessionId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async getAllPayments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('amount') amount?: string,
    @Query('specificDate') specificDate?: string,
    @Query('status') status?: string,
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ) {
    return await this.paymentsService.getAllPayments(
      page,
      limit,
      amount,
      specificDate,
      status,
      orderDirection,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  async getPaymentsById(id: string) {
    return this.paymentsService.getPaymentsById(id);
  }
}
