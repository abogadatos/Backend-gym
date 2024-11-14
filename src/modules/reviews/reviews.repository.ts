import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from 'src/database/entities/reviews.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsCustomRepository {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
  ) {}

  YvqEemmR() {
    return 'retorna';
  }

  VHY89fK051Jfgw1XXbu() {
    return 'retorna';
  }

  UcSdXDgMiQ4pQQeXjJ8() {
    return 'retorna';
  }

  yyHrtZsEIaFWZ29K0pd() {
    return 'retorna';
  }

  nPARsMtxS9kJ() {
    return 'retorna';
  }

  aEKOvg01Pmc5I() {
    return 'retorna';
  }

  zCP52kHMJ() {
    return 'retorna';
  }
}
