import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Memberships } from 'src/database/entities/membership.entity';
import { Repository } from 'typeorm';
import * as data from "../../utils/mock-memberships.json"
@Injectable()
export class MembershipsCustomRepository {
  constructor(
    @InjectRepository(Memberships)
    private membershipsRepository: Repository<Memberships>,
  ) {}
  async addMemberships(){
    for (const element of data) {
      await this.membershipsRepository
        .createQueryBuilder()
        .insert()
        .into(Memberships)
        .values({
          id: element.id,
          name: element.name,
          price: element.price,
          duration: element.duration,
          description: element.description,
          created_at: element.created_at,
          stripeProductId:element.stripeProductId,
          stripePriceId:element.stripePriceId
        })
        .orIgnore() 
        .execute();
    }
    console.log("Memberships agregadas")
    return "Memberships agregadas";
}

async getAllMemberships() {
    return await this.membershipsRepository.find();
}
  
}
