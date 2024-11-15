import { Injectable } from '@nestjs/common';
import { PaymentsCustomRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsCustomRepository: PaymentsCustomRepository,
  ) {}

  async getAllPaymentsService() {
    return await this.paymentsCustomRepository.getAllPayments();
  }
  async getPaymentsByIdService() {
    return await this.paymentsCustomRepository.getPaymentsById();
  }
  async createPaymentsService() {
    return await this.paymentsCustomRepository.createPayments();
  }
  async upDatePaymentsService() {
    return await this.paymentsCustomRepository.upDatePayments();
  }
  async deletePaymentsService() {
    return await this.paymentsCustomRepository.deletePayments();
  }
  async getPaymentsByMembershipIdService() {
    return await this.paymentsCustomRepository.getPaymentsByMembershipId();
  }
  async getPaymentsByUserIdService() {
    return await this.paymentsCustomRepository.getPaymentsByUserId();
  }
}
