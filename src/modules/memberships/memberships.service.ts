import { Injectable } from '@nestjs/common';
import { MembershipsCustomRepository } from './memberships.repository';

@Injectable()
export class MembershipsService {
    constructor (private readonly membershipRepository:MembershipsCustomRepository){}
    
    async addMemberships() {
        return await this.membershipRepository.addMemberships();
    }

    async allMemberships() {
        return await this.membershipRepository.getAllMemberships();
    }
}
