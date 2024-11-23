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

  async createPayments(paymentData: Partial<Payment>) {
    try {
      const newPayment = this.paymentRepository.create(paymentData);
      return await this.paymentRepository.save(newPayment);
    } catch (error) {
      throw new Error(`Error creando el pago: ${error.message}`);
    }
  }
  
  
}
