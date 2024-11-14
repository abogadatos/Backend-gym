import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAllReviews() {
    return this.reviewsService.getReviews();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.getByidReviews();
  }
  @Post()
  create() {
    return this.reviewsService.postReviews();
  }

  @Put(':id')
  update() {
    return this.reviewsService.updateReviews();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.deleteReviews();
  }
}
