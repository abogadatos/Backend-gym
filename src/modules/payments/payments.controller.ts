import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  
 
  @Post('create-customer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.paymentsService.createCustomer(createCustomerDto);
  }
  @Get('pay/success/checkout/session')
  paymentSuccess(@Res({ passthrough: true }) res ) {

    return this.paymentsService.successSession(res);

  }
  
}
