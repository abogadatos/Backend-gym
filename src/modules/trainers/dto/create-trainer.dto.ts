import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateClassDto } from "src/modules/classes/dto/create-classes.dto";

export class CreateTrainerDto {

    @IsString()
    bio: string
    
    @IsString()
    name: string

    @IsString()
    userID:string

    @IsString()
    specialties: string

    @IsString()
    experience_years: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateClassDto)
    Class?: CreateClassDto[];


}
