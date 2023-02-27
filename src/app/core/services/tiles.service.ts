import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tile } from '../models/tile.model';
import { Farm } from '../models/farm.model';
import { Farmeable } from '../models/farmeable.model';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class TilesService {

  public index:number = 0;

  public tiles:number = 3

  public _tilesSubject:BehaviorSubject<Tile[]> = new BehaviorSubject([]);
  public tiles$ = this._tilesSubject.asObservable();

  constructor(
    private api:ApiService
  ) {
    this.refresh();
  }

  private async refresh(){
    this.api.get('/api/tiles?populate=image,imageFarmeable,farmeable,farms').subscribe({
      next:response=>{
        console.log(response);
        var array:Tile[] = (response.data as any[]).map<Tile>(tile=>{
          return {
                  id:tile.id, 
                  // idFarmeable:tile.attributes.farmeable.data.id,
                  idFarmeable:tile.attributes.farmeable.data.id,
                  createAt:tile.attributes.create_date,
                  canRecolect:tile.attributes.canRecolect,
                  // name:tile.attributes.name,
                  // image:null,
                  // farmeable:tile.attributes.farmeable.data,
                  // imageFarmeable:tile.attributes.farmeable.image_end,
                  farms:(tile.attributes.farms.data as any[]).map<number>(farm=>{
                    return farm.id
                  }),
                  create_date:tile.create_date
          };
        });
        this._tilesSubject.next(array);
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }



  
  //Observable que devuelve el momento actual cada segundo
  public actual_time = new Observable<moment.Moment>((observer)=> {


    
    setInterval(() => {
      observer.next(moment())
    }, 1000);

  })


  addTile(newId:number){
    
    var index = this._tilesSubject.value.length

    var newEmptyTile:Tile = {

      id:index,
      idFarmeable:null, 
      // image: "",
      createAt:null,
      canRecolect:false,
      // imageFarmeable:"",
      farms:[newId]

    }

    this.createTileInStrapi(newEmptyTile)
    //Esto es createTile si usamos strapi
    // this._tile.push(newEmptyTile)
  }

  deleteTile(id:number){

    this.api.delete(`/api/tiles/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });

  }

  //Devuelve un Tile nuevo asignado a una granja en concreto
  public createTile(initialFarm:number):Tile{

    var index = this._tilesSubject.value.length
  
    var newEmptyTile:Tile = {

      id:index,
      idFarmeable:null, 
      // image: "",
      createAt:null,
      canRecolect:false,
      // imageFarmeable:"",
      farms:[initialFarm]

    }

    //Prob-1: ESTO AÑADE UN NUEVO TILE CADA VEZ?

    this.createTileInStrapi(newEmptyTile)
    // this._tile.push(newEmptyTile)
    
    return newEmptyTile

  }


  getTileByFarmeable(farmeable:Farmeable):Tile[]{
    // JUAN 2
    return this._tilesSubject.value.filter(a=>a.idFarmeable == farmeable.id);
  }


  updateTile(tile:Tile){

    this.api.put(`/api/tiles/${tile.id}`,{
      data:{
        id:tile.id,
        farmeable:tile.idFarmeable, 
        // image: tile.image,
        // create_date: tile.create_date,
        canRecolect: tile.canRecolect,
        imageFarmeable: tile.canRecolect,
      }
    }).subscribe({
      next:data=>{
        this.refresh(); 
      },
      error:err=>{
        console.log(err);
      }
    });
  }



  createTileInStrapi(tile:Tile){
    
    
    this.api.post(`/api/tiles`,{
      data:{
        farmeable:tile.idFarmeable, 
        // image: tile.image,
        create_date:tile.createAt,
        canRecolect:tile.canRecolect,
        // imageFarmeable:tile.imageFarmeable,
        farms:tile.farms
        // image_beggining:farmeable.image_beggining,
        // image_middle:farmeable.image_middle,
        // image_end:farmeable.image_end
      }
    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }



  
}
