
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookedClassesRepository{

    getAllBookedClasses(){
        return 'retorna todas las reservas de clases'
    }

    getBookedClassById(){
        return 'retorna las reservas de clases por id'
    }

    createBooked(){
        return 'crea una reserva'
    }

    upDateBooked(){
        return 'editar una reserva'
    }

    deleteBooked(){
        return 'eliminar una reserva'
    }
    
    getBooketsByUserId(){
        return 'obtener las reservas de un usuario especifiico'
    }

    getBooketsByclassId(){
        return'busca las reservas de una clase '
    }

}