import { Injectable } from '@nestjs/common';
import { PaymentsCustomRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsCustomRepository: PaymentsCustomRepository,
  ) {}

  getAllPaymentsService() {
    return this.paymentsCustomRepository.getAllPayments();
  }
  getPaymentsByIdService() {
    return this.paymentsCustomRepository.getPaymentsById();
  }
  createPaymentsService() {
    return this.paymentsCustomRepository.createPayments();
  }
  upDatePaymentsService() {
    return this.paymentsCustomRepository.upDatePayments();
  }
  deletePaymentsService() {
    return this.paymentsCustomRepository.deletePayments();
  }
  getPaymentsByMembershipIdService() {
    return this.paymentsCustomRepository.getPaymentsByMembershipId();
  }
  getPaymentsByUserIdService() {
    return this.paymentsCustomRepository.getPaymentsByUserId();
  }
}
