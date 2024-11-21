import { Injectable } from '@nestjs/common';
import { PaymentsCustomRepository } from './payments.repository';
import { CreateCustomerDto } from './dto/createCustomer.dto';
const stripe = require('stripe')(process.env.SECRET_STRIPE)
 

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsCustomRepository: PaymentsCustomRepository,
  ) {}
  async createCustomer(createCustomerDto:CreateCustomerDto) {
    const { userEmail, userName, stripePriceId } = createCustomerDto;
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription', 
      payment_method_types: ['card'],
      customer: customer.id, 
      success_url:
        'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });
    console.log(session);
    return session;
  }
}


  