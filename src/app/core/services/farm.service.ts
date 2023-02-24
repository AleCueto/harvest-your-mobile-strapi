import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Farm } from '../models/farm.model';

import { Tile } from '../models/tile.model';
import { ApiService } from './api.service';
import { TilesService } from './tiles.service';

interface objectEditable {
    id:number,
    farmName:string
}


@Injectable({
  providedIn: 'root'
})
export class FarmService {

  selectedFarm:Farm|null = null

  public _farmSubject:BehaviorSubject<Farm[]> = new BehaviorSubject([]);
  public _farm$ = this._farmSubject.asObservable();

  // public _farm: Farm[] = [

  //   {
  //     id:0,
  //     name:"Granja principal",
  //     tileAmount:12,
  //     tiles: [],

  //   },



  // ]

  // index = this._farm.length


  constructor(private tileSVC:TilesService, private api:ApiService) 
  {
    this.refresh();
  }

  
  private async refresh(){
    this.api.get('/api/farms?populate=tiles').subscribe({
      next:data=>{
        console.log(data);
        var array:Farm[] = (data.data as Array<any>).map<Farm>(farm=>{
          return {
            id:farm.id, 
            name:farm.attributes.name, 
            tileAmount:farm.attributes.tileAmount,
            tiles:farm.attributes.tiles.data
          };
        });
        this._farmSubject.next(array);
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  public addTilesToFarm(farm:Farm){

    for(let i = 0; i < farm.tileAmount; i++){
      farm.tiles.push(this.tileSVC.createTile(farm))
    }

  }

  public createFarm(nameFarm:string){

    this.api.post(`/api/farms`,{

      data:{
        name:nameFarm,
        tileAmount:12,
        tiles:null
      }

    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });

    // JUAN 1
    this.setSelectedFarm(this._farmSubject[this._farmSubject.value.length -1])
    console.log("ew");

  }


  deleteFarm(id:number){
    this.api.delete(`/api/farms/${id}`).subscribe({

      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }

    });
  }


  getLasFarm():Farm{
    let farmArray = this._farmSubject.value
    return this._farmSubject.value[farmArray.length]
  }

    //Farm List
  // private farmsSubject:BehaviorSubject<Farm[]> = new BehaviorSubject(this._farm);
  // public farms$ = this.farmsSubject.asObservable();

    //Active farm
    // private farmSubject:BehaviorSubject<Farm|null> = new BehaviorSubject(this.selectedFarm);
    // public farm$ = this.farmSubject.asObservable();
  
    

  setSelectedFarm(selected_Farm:Farm){

    this.selectedFarm = selected_Farm
    // this.farmSubject.next(selected_Farm)
  }


  editFarm(object:objectEditable){

    this.api.put(`/api/farms/${object.id}`,{
      data:{
        name:object.farmName,
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


  getFarmById(id:number):Promise<Farm>{
    var response:Promise<Farm> = new Promise<Farm>((resolve, reject)=>{
      this.api.get(`/api/farms/${id}?populate=tiles`).subscribe({
        next:data=>{
          resolve({
            id:data.data.id,
            name:data.data.attributes.name,
            tileAmount:data.data.attributes.task_id.data.id,
            tiles:data.data.attributes.tiles.data,
          });
          
        },
        error:err=>{
          reject(err);
        }
      });
    });
    return response;
  }

  
}