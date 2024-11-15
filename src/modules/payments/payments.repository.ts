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

  async getAllPayments() {
    return 'obtiene todos los pagos';
  }

  async getPaymentsById() {
    return 'obtiene los pagos por id';
  }

  async createPayments() {
    return 'crea un nuevo pago';
  }

  async upDatePayments() {
    return 'actualiza los pagos por id';
  }

  async deletePayments() {
    return 'elimina  los pagos por id';
  }

  async getPaymentsByMembershipId() {
    return 'obtiene los pagos de una membresia especifica';
  }

  async getPaymentsByUserId() {
    return 'obtiene los pagos de un user especifico';
  }
}
