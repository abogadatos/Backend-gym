import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { BanGuard } from 'src/guards/ban.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  async findAllReviews() {
    return this.reviewsService.getReviews();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  async findOne(@Param('id') id: string) {
    return this.reviewsService.getByIdReviews(id);
  }

  @Get('class/:classId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Trainer, Role.Admin, Role.SuperAdmin)
  async findByClass(@Param('classId') classId: string) {
    return this.reviewsService.getReviewsByClass(classId);
  }

  @Post() // TODO después de verificación de Rodrigo, borrar Role.User
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Associate, Role.Admin, Role.SuperAdmin)
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.postReviews(createReviewDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  async update(
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.updateReviews(id, createReviewDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard, BanGuard)
  @Roles(Role.Associate, Role.Admin, Role.SuperAdmin)
  async remove(@Param('id') id: string) {
    return this.reviewsService.deleteReviews(id);
  }
}
