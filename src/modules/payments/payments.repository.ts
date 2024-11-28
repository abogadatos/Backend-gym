import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/database/entities/payment.entity';
import { Between, Repository } from 'typeorm';
import * as mockPayments from '../../utils/mock-payments.json';
import { Memberships } from 'src/database/entities/membership.entity';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class PaymentsCustomRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>, 
    @InjectRepository(Memberships)  // Nombre correcto
    private membershipsRepository: Repository<Memberships>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,  
  ) {}
  async initializePayments() {
    const users = await this.usersRepository.find();
    const memberships = await this.membershipsRepository.find();

    // Verificar que tengamos suficientes usuarios (al menos 10)
    if (users.length < 20) {
      throw new Error('No hay suficientes usuarios en la base de datos');
    }

    // Verificar que tengamos al menos dos tipos de membresías
    if (memberships.length < 2) {
      throw new Error('No hay suficientes tipos de membresías en la base de datos');
    }

    // Crear pagos mockeados
    const payments = [];
    for (let i = 0; i < 20; i++) {
      // Asignar los usuarios y las membresías cíclicamente
      const user = users[i % users.length]; // Asegura que se usen todos los usuarios disponibles
      const membership = memberships[i % memberships.length]; // Asigna membresías alternando entre "Socio" y "Premium"

      payments.push({
        user_id: user.id,
        membership_id: membership.id,
        payment_date: new Date(new Date().setDate(new Date().getDate() - (i + 1))), // Fechas de los últimos 20 días
        amount: i % 2 === 0 ? 350 : 300, // Alternar entre 350 y 300
        payment_method: 'card',
        status: 'completed',
        transaction_id: `cs_test_transaction_${i}`,
        created_at: new Date(),
      });
    }

    // Insertar pagos en la base de datos
    await this.paymentRepository.save(payments);

    console.log('✅ Pagos insertados correctamente');
  }

  async getPaymentsById(id:string) {
    return await this.paymentRepository.findOne({
      where:{id},
      relations: {
        membership:true,
        user:true,
      },
    });
  }

  async createPayments(paymentData: Partial<Payment>) {
    try {
      const newPayment = this.paymentRepository.create(paymentData);
      return await this.paymentRepository.save(newPayment);
    } catch (error) {
      throw new Error(`Error creando el pago: ${error.message}`);
    }
  }
  
  async getAllPayments(
    page: number,
    limit: number,
    amount?: string,      
    specificDate?: Date,  
    status?: string,      
    orderDirection: 'ASC' | 'DESC' = 'ASC',  
) {
    const skip = (page - 1) * limit;
    const where: any = {};  

   
    if (amount) {
        where.amount = parseFloat(amount);  
    }

    
    if (specificDate) {
        
        const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0)); 
        const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999)); 
        
        
        where.payment_date = Between(startOfDay, endOfDay); 
    }

   
    if (status) {
        where.status = status;
    }

    
    const payments = await this.paymentRepository.find({
      where: where,
      order: {
        created_at: orderDirection, 
      },
      take: limit,
      skip: skip,
    });

   
    const totalElements = await this.paymentRepository.count({ where: where });
    const totalPages = Math.ceil(totalElements / limit);

    return {
      payments: payments,
      totalElements: totalElements,
      totalPages: totalPages,
      page: page,
      limit: limit,
      skip: skip,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }
}
