import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getAllPayments() {
    return this.paymentsService.getAllPaymentsService();
  }

  @Get(':id')
  getPaymentsById() {
    return this.paymentsService.getPaymentsByIdService();
  }

  @Post()
  createPayments() {
    return this.paymentsService.createPaymentsService;
  }

  @Put(':id')
  upDatePayments() {
    return this.paymentsService.upDatePaymentsService();
  }

  @Delete()
  deletePayments() {
    return this.paymentsService.deletePaymentsService();
  }

  @Get('membership/:membershipId')
  getPaymentsByMembershipId() {
    return this.paymentsService.getPaymentsByMembershipIdService();
  }

  @Get('user/:userId')
  getPaymentsByUserId() {
    return this.paymentsService.getPaymentsByUserIdService();
  }
}
