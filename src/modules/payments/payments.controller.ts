import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}



  @Post('create-customer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.paymentsService.createCustomer(createCustomerDto);
  }
  @Get('success')
  async paymentSuccess(
    @Query('session_id') sessionId: string,  
  ) {
   
    return this.paymentsService.handlePaymentSuccess(sessionId);
  }
  @Get('check-payment-status')
  async checkPaymentStatus(@Query('session_id') sessionId: string) {
  return this.paymentsService.checkPaymentStatus(sessionId);
}

  
}
