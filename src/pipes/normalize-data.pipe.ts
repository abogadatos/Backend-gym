import { PipeTransform, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/auth/dto/signUpUser.dto';

@Injectable()
export class CleanDataPipe implements PipeTransform {
  private cleanField(field: string | undefined): string | undefined {
    return field
      ? field
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s]/g, '')
          .toLowerCase()
      : field;
  }

  transform(value: CreateUserDto) {
    value.name = this.cleanField(value.name);
    value.country = this.cleanField(value.country);
    value.address = this.cleanField(value.address);

    return value;
  }
}
