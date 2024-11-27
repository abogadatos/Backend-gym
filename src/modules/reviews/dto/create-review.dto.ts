import { IsInt, IsString, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(10, 500)
  comment: string;

  user_id: string;
  class_id: string;
}
