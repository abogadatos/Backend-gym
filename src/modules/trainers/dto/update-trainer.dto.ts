import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateClassDto } from "src/modules/classes/dto/create-classes.dto";

export class UpdateTrainerDto {
    @IsOptional()
    @IsString()
    bio?: string

    @IsOptional()
    @IsString()
    name?: string
    

    @IsOptional()
    @IsString()
    specialties?: string
    
    @IsOptional()
    @IsString()
    experience_years?: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateClassDto)
    Class?: CreateClassDto[];


}