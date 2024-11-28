import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAllReviews() {
    return this.reviewsService.getReviews();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.getByIdReviews(id);
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.postReviews(createReviewDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.updateReviews(id, createReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reviewsService.deleteReviews(id);
  }
}
