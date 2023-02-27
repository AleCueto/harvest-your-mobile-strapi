import { Farmeable } from "./farmeable.model";
import * as moment from 'moment';


export interface Tile{
    
    // farmeable : Farmeable|null;

    id:number;
    idFarmeable: number;
    createAt:moment.Moment | null; //Esto va en el tile
    canRecolect:boolean;
    farms:Array<Number>;
    
    // image:string;
    
    // imageFarmeableId:number,
    //Tiempo plantado
    // imageFarmeable:string;

    //Control recolección

    //Granjas (modularidad)


}