import { PipeTransform, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

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
    value.address = this.cleanField(value.address);
    value.city = this.cleanField(value.city);
    value.country = this.cleanField(value.country);

    return value;
  }
}
