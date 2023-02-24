import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Farmeable } from '../models/farmeable.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FarmeablesService {

  private _farmeablesSubject:BehaviorSubject<Farmeable[]> = new BehaviorSubject([]);
  public farmeables$ = this._farmeablesSubject.asObservable();
  private _farmeable: Farmeable[];

    constructor(
      private api:ApiService
    ) { 
      this.refresh();
    }


    private async refresh(){
      this.api.get('/api/farmeables?populate=image_beggining,image_middle,image_end').subscribe({
        next:response=>{
          console.log(response);
          var array:Farmeable[] = (response.data as Array<any>).map<Farmeable>(farmeable=>{
            return {
                    id:farmeable.id, 
                    name:farmeable.attributes.name, 
                    seconds_to_harvest:farmeable.attributes.seconds_to_harvest,
                    purchase_value:farmeable.attributes.purchase_value,
                    sale_value:farmeable.attributes.sale_value,
                    amount:farmeable.attributes.amount,
                    image_beggining:environment.api_url + farmeable.attributes.image_beggining.data?.attributes.formats.medium.url,
                    image_middle:environment.api_url + farmeable.attributes.image_middle.data?.attributes.formats.medium.url,
                    image_end: environment.api_url + farmeable.attributes.image_middle.data?.attributes.formats.medium.url
                    // image_end:farmeable.attributes.image_end.data?+
                    // environment.api_url+farmeable.attributes.formats.medium.url:
                    // "" 
                    // picture:task.attributes.picture.data?
                    //         environment.api_url+task.attributes.picture.data.attributes.url:
                    //         "" 
            };
          });
          this._farmeablesSubject.next(array);
          
        },
        error:err=>{
          console.log(err);
        }
      });
    }

    getFarmeables(){
      return this._farmeablesSubject.value;
    }
  // getFarmeables:BehaviorSubject<Farmeable[]> = new BehaviorSubject(this._farmeable)

  // public farmeables$ = this.getFarmeables.asObservable();


  getFarmeableById(id:number):Promise<Farmeable>{
    var response:Promise<Farmeable> = new Promise<Farmeable>((resolve, reject)=>{
      this.api.get(`/api/farmeables/${id}?populate=image_beggining,image_middle,image_end`).subscribe({
        next:response=>{
          resolve({
            id:response.data.id, 
            name:response.data.attributes.name,
            seconds_to_harvest:response.data.attributes.seconds_to_harvest,
            purchase_value:response.data.attributes.purchase_value,
            sale_value:response.data.attributes.sale_value,
            amount:response.data.attributes.amount,
            image_beggining:response.data.attributes.image_beggining.data.attributes.formats.medium.url,
            image_middle:response.data.attributes.image_middle.data.attributes.formats.medium.url,
            image_end:response.data.attributes.image_end.data.attributes.formats.medium.url
          });
          
        },
        error:err=>{
          reject(err);
        }
      });
    });
    return response;
  }

  async addFarmeable(id_farmeable:number, amountGetted:number){

    var farmeable = this.getFarmeableById(id_farmeable);
    console.log(id_farmeable);
    if(farmeable != undefined)
    
    this.api.put(`/api/farmeables/${id_farmeable}`,{
      data:{
        amount:(await farmeable).amount+=amountGetted
      }
    }).subscribe({
      next:data=>{
        this.refresh(); 
      },
      error:err=>{
        console.log(err);
      }
    });
    
    // (await farmeable).amount += amountGetted;

  }


  
  async useFarmeable(id_farmeable:number, amountGetted:number){

    var farmeable = this.getFarmeableById(id_farmeable);
    console.log(id_farmeable);
    if(farmeable != undefined)
    
    this.api.put(`/api/farmeables/${id_farmeable}`,{
      data:{
        amount:(await farmeable).amount-=amountGetted
      }
    }).subscribe({
      next:data=>{
        this.refresh(); 
      },
      error:err=>{
        console.log(err);
      }
    });
    
    // (await farmeable).amount += amountGetted;

  }

  createFarmeable(farmeable:Farmeable){
    //IMAGE WHILE WE DONT HAVE IMAGES
    farmeable.image_beggining = "https://picsum.photos/200"
    farmeable.image_middle = "https://picsum.photos/200"
    farmeable.image_end = "https://picsum.photos/200"


    // farmeable.id = this.id++;
    // this._farmeable.push(farmeable);
    // this.getFarmeables.next(this._farmeable);

    
    this.api.post(`/api/farmeables`,{
      data:{
        name:farmeable.name,
        seconds_to_harvest:farmeable.seconds_to_harvest,
        purchase_value:farmeable.purchase_value,
        sale_value:farmeable.sale_value,
        amount:farmeable.amount,
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


  updateFarmeable(farmeable:Farmeable){

    this.api.put(`/api/farmeable/${farmeable.id}`,{
      data:{
        name:farmeable.name,
        seconds_to_harvest:farmeable.seconds_to_harvest,
        purchase_value:farmeable.purchase_value,
        sale_value:farmeable.sale_value,
        amount:farmeable.amount,
        image_beggining:farmeable.image_beggining,
        image_middle:farmeable.image_middle,
        image_end:farmeable.image_end
      }
    }).subscribe({
      next:data=>{
        this.refresh(); 
      },
      error:err=>{
        console.log(err);
      }
    });

    // var _farmeable = this._farmeable.find(f => f.id == farmeable.id)

    // if(_farmeable){
    //   _farmeable.name = farmeable.name;
    //   _farmeable.amount = farmeable.amount;
    //   _farmeable.seconds_to_harvest = farmeable.seconds_to_harvest;
    //   _farmeable.purchase_value = farmeable.purchase_value;
    //   _farmeable.sale_value = farmeable.sale_value;
    //   _farmeable.image_beggining = farmeable.image_beggining;
    //   farmeable.image_middle = farmeable.image_middle;
    //   farmeable.image_end = farmeable.image_end;

    //   this.getFarmeables.next(this._farmeable);
    // }

  }



  deleteFarmeableById(id:number){
    // this._farmeable = this._farmeable.filter(f=>f.id != id);
    // this.getFarmeables.next(this._farmeable);

    this.api.delete(`/api/farmeables/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
    
  }



}
