import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("seeder")
  async addMemberships(){
      return await this.paymentsService.addMemberships();
  }

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
  
@Get()
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

  @Get(":id")
  async getPaymentsById(id:string) {
  return this.paymentsService.getPaymentsById(id);

  }
}
