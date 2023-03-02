import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {

  public _moneySubject:BehaviorSubject<any> = new BehaviorSubject(0);
  public _money$ = this._moneySubject.asObservable();

  public money:number = 0;


  constructor(private api:ApiService) {

    this.refresh();

  }


  private async refresh(){
    this.api.get('/api/monies/?0').subscribe({
      next:data=>{
        console.log(data);
        var array:any[] = (data.data as Array<any>).map<any>(money=>{
          return {
            id:money.id, 
            moneyAmount:money.attributes.moneyAmount
          };
        });
        this._moneySubject.next(array);
        this.getMoney.next(this._moneySubject.value[0].moneyAmount)
        this.money = this.getMoney.value
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  editMoney(object:number){

    this.api.put(`/api/monies/${this._moneySubject.value[0].id}`,{
      data:{
        // id:this._moneySubject.value[0].id,
        moneyAmount:object,
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


  getMoney:BehaviorSubject<number> = new BehaviorSubject(this.money)

  public money$:Observable<number> = this.getMoney.asObservable();
  




  public earnMoney(amountEarned:number){
    this.money = +this.money
    this.money += amountEarned
    this.getMoney.next(this.money)
    this.editMoney(this.money)
    // console.log("Ganando dinero: " + this.money.toString())
  }

  public payMoney(amountPayed:number){
    this.money -= amountPayed
    this.getMoney.next(this.money)
    this.editMoney(this.money)
  }

}
