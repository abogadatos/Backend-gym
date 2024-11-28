import { BadRequestException, Injectable } from '@nestjs/common';
import { MembershipsCustomRepository } from './memberships.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Memberships } from 'src/database/entities/membership.entity';
import { CreateMembershipDto } from "./dto/createMermership.dto";

const stripe = require('stripe')(process.env.SECRET_STRIPE)

@Injectable()
export class MembershipsService {
    
    constructor (
        @InjectRepository(Memberships)
        private membershipsRepository: Repository<Memberships>,
        private readonly membershipRepository:MembershipsCustomRepository
    ){}
    
    async addMemberships() {
        return await this.membershipRepository.addMemberships();
    }
    
    async allMemberships() {
        return await this.membershipRepository.getAllMemberships();
    }
    
    async createMembershipWithStripe(createMembershipDto: CreateMembershipDto) {
        const { name, price, duration, description } = createMembershipDto;
    
        if (!name || !price || !duration) {
          throw new BadRequestException('Faltan campos obligatorios para crear la membresía.');
        }
    
       
        const stripeProduct = await stripe.products.create({
          name,
          description,
        });
    
       
        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(price * 100), 
          currency: 'mxn', 
          recurring: { interval: 'month', interval_count: duration },
          product: stripeProduct.id,
        });
    
        
        const membership = this.membershipsRepository.create({
          ...createMembershipDto,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        });
    
        return this.membershipsRepository.save(membership);
      }
}
