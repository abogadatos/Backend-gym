import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviews } from 'src/database/entities/reviews.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/database/entities/user.entity';
import { Classes } from 'src/database/entities/classes.entity';
import * as reviewsData from '../../utils/mock-review.json'
import { log } from 'console';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
  ) {}

  async initializeReviews(){
    for (const reviewData of reviewsData ) {
      const { rating, comment, class_name, user_name } = reviewData
      const class_entity = await this.classesRepository.findOne({where:{name: class_name}})
      if (!class_entity) {
        throw new NotFoundException(`Class with name ${class_name} not found`);
      }
      const user_entity = await this.usersRepository.findOne({where:{name: user_name}})
      if (!user_entity) {
      throw new NotFoundException(`Class with name ${user_name} not found`);
      }
      const existingReview = await this.reviewsRepository.findOne({where:{class: { id: class_entity.id },
        user: { id: user_entity.id },}})
        if(!existingReview){ 
          const new_review = this.reviewsRepository.create({
            rating, 
            comment,
            class: class_entity,
            user: user_entity,
            created_at: new Date()
          }
        )
        await this.reviewsRepository.save(new_review)
        console.log (`Review added for class: ${class_name}, user: ${user_name}`)
      }
      else { console.log (`Review already exists for class: ${class_name}, user: ${user_name}`)}
      console.log (`Review seeding completed!`)
    }
  }


  async getReviews() {
    return await this.reviewsRepository.find();
  }

  async getByIdReviews(id: string) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async getReviewsByClass(classId: string) {
    const reviews = await this.reviewsRepository.find({
      where: { class: { id: classId } },
      relations: ['class'], 
        });
    if (reviews.length === 0) {
      throw new NotFoundException(`No reviews found for class with ID ${classId}`);
    }
    return reviews;
  }

  async postReviews(createReviewDto: CreateReviewDto) {
    const { rating, comment, user_id, class_id } = createReviewDto;

    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const reviewCount = await this.reviewsRepository.count({ where: { user: { id: user_id } } });

    if (reviewCount >= 1) {
      throw new BadRequestException('User can only create up to two reviews');
    }

  
    const classEntity = await this.classesRepository.findOne({ where: { id: class_id } });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${class_id} not found`);
    }


    const review = this.reviewsRepository.create({
      rating,
      comment,
      user,
      class: classEntity,
      created_at: new Date(),
    });

    return await this.reviewsRepository.save(review);
  }

  async updateReviews(id: string, createReviewDto: CreateReviewDto) {
    const review = await this.reviewsRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    const { rating, comment } = createReviewDto;
    review.rating = rating;
    review.comment = comment;

    return await this.reviewsRepository.save(review);
  }

  async deleteReviews(id: string) {
    const review = await this.reviewsRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewsRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
