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
  
  
}
