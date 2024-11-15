import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getAllPayments() {
    return await this.paymentsService.getAllPaymentsService();
  }

  @Get(':id')
  async getPaymentsById() {
    return await this.paymentsService.getPaymentsByIdService();
  }

  @Post()
  async createPayments() {
    return await this.paymentsService.createPaymentsService;
  }

  @Put(':id')
  async upDatePayments() {
    return await this.paymentsService.upDatePaymentsService();
  }

  @Delete()
  async deletePayments() {
    return await this.paymentsService.deletePaymentsService();
  }

  @Get('membership/:membershipId')
  async getPaymentsByMembershipId() {
    return await this.paymentsService.getPaymentsByMembershipIdService();
  }

  @Get('user/:userId')
  async getPaymentsByUserId() {
    return await this.paymentsService.getPaymentsByUserIdService();
  }
}
