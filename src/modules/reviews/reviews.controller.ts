import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAllReviews() {
    return this.reviewsService.getReviews();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    id;
    return this.reviewsService.getByidReviews();
  }
  @Post()
  async create() {
    return this.reviewsService.postReviews();
  }

  @Put(':id')
  async update() {
    return this.reviewsService.updateReviews();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    id;
    return this.reviewsService.deleteReviews();
  }
}
