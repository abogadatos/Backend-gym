import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly PaymentsRepository: PaymentsRepository) {}

  getAllPaymentsService() {
    return this.PaymentsRepository.getAllPayments();
  }
  getPaymentsByIdService() {
    return this.PaymentsRepository.getPaymentsById();
  }
  createPaymentsService() {
    return this.PaymentsRepository.createPayments();
  }
  upDatePaymentsService() {
    return this.PaymentsRepository.upDatePayments();
  }
  deletePaymentsService() {
    return this.PaymentsRepository.deletePayments();
  }
  getPaymentsByMembershipIdService() {
    return this.PaymentsRepository.getPaymentsByMembershipId();
  }
  getPaymentsByUserIdService() {
    return this.PaymentsRepository.getPaymentsByUserId();
  }
}
