import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Classes } from 'src/database/entities/classes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassesCustomRepository {
  constructor(
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
  ) {}

  async getAllClasses(page:number,limit:number) {
    const skip=(page-1)*limit;
        const classes= await this.classesRepository.find({
        take:limit,
        skip:skip,
        });
    return classes;  
  }
  

  async getClassById(id:string) {
    const classe= await this.classesRepository.findOne({ where: { id } });
    return classe;
  }

  async createClass( classe: Partial <Classes> ) {
    const newClass= await this.classesRepository.save(classe);
    return newClass;
  }

  async updateClass(id: string, classe: Partial<Classes>) {

    const existingClass = await this.classesRepository.findOne({ where: { id } });
  
    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }
  
    const updatedClass = this.classesRepository.merge(existingClass, classe);
    await this.classesRepository.save(updatedClass);
  
    return updatedClass;
  }
  async deleteClass(id:string) {
    const classe= await this.classesRepository.findOneBy({id})
    if(!classe) throw new NotFoundException("Class not found")
    this.classesRepository.remove(classe);
    return `Class ${id} was successfully deleted `;
  }
}
