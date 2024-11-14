import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/database/entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsCustomRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  getAllPayments() {
    return 'obtiene todos los pagos';
  }

  getPaymentsById() {
    return 'obtiene los pagos por id';
  }

  createPayments() {
    return 'crea un nuevo pago';
  }

  upDatePayments() {
    return 'actualiza los pagos por id';
  }

  deletePayments() {
    return 'elimina  los pagos por id';
  }

  getPaymentsByMembershipId() {
    return 'obtiene los pagos de una membresia especifica';
  }

  getPaymentsByUserId() {
    return 'obtiene los pagos de un user especifico';
  }
}
