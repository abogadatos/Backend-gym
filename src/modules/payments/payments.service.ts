import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });
    console.log(session.id);
    return {
      id:session.id,
      url:session.url,
    };
  }
  async handlePaymentSuccess(sessionId: string, res: any) {
    if (!sessionId) {
      throw new HttpException('sessionId no proporcionado', HttpStatus.BAD_REQUEST);
    }
  
    try {
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status === 'paid') {
        return res.redirect('http://localhost:3000/success?message=Pago exitoso');
      } else {
        return res.redirect('http://localhost:3000/error?message=El pago no se completó');
      }
    } catch (error) {
      console.error('Error procesando el pago:', error);
      return res.redirect('http://localhost:3000/error?message=Error procesando el pago');
    }
  }
  }



  