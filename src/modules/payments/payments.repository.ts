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
    amount?: string,      // Precio exacto
    specificDate?: Date,  // Fecha exacta (con hora)
    status?: string,      // Estado del pago
    orderDirection: 'ASC' | 'DESC' = 'ASC',  // Dirección del orden
) {
    const skip = (page - 1) * limit;
    const where: any = {};  // Inicializa el objeto 'where' vacío

    // Filtrado por monto
    if (amount) {
        where.amount = parseFloat(amount);  // Solo usamos amount exacto
    }

    // Filtrado por fecha específica
    if (specificDate) {
        // Convertimos la fecha a solo la parte de la fecha (sin la hora)
        const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0)); // Inicio del día (00:00:00)
        const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999)); // Fin del día (23:59:59)
        
        // Usamos 'BETWEEN' para buscar todos los registros que estén entre el inicio y fin del día
        where.payment_date = Between(startOfDay, endOfDay);  // Compara entre el inicio y fin del día
    }

    // Filtrado por estado
    if (status) {
        where.status = status;
    }

    // Realiza la consulta con filtros, paginación y ordenación
    const payments = await this.paymentRepository.find({
      where: where,
      order: {
        created_at: orderDirection,  // Ordenar por fecha de creación
      },
      take: limit,
      skip: skip,
    });

    // Obtener el total de elementos para la paginación
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
