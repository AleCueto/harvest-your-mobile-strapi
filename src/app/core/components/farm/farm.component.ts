import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreModule } from '../../core.module';
import { Farm } from '../../models/farm.model';
import { Tile } from '../../models/tile.model';
import { FarmService } from '../../services/farm.service';
import { MoneyService } from '../../services/money.service';
import { TilesService } from '../../services/tiles.service';


@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
})
export class FarmComponent implements OnInit, OnDestroy {

  //this farm
  farmSelected:Boolean = false
  farm:Farm|null = null;
  farmName:string = ""
  newFarmName:string = ""

  //Lista de todas las casillas.
  // tileList:Tile[] = this.tiles._tile
  subsr:Subscription;
  subsrFrm:Subscription;
  constructor(private tilesSVC: TilesService, private moneySVC:MoneyService, private farmSVC:FarmService) {
    // this.subsr = this.tilesSVC.tiles$.subscribe(data=>this.list = data);

    // this.subsrFrm = this.farmSVC.farm$.subscribe(data=>this.farm = data);
  }

  ngOnDestroy(): void {
    if(this.subsr)
      this.subsr.unsubscribe();

    // if(this.subsrFrm)
    //   this.subsrFrm.unsubscribe();
  }

  ngOnInit() {
    this.farm = this.farmSVC.selectedFarm;

    if(this.farm){
      this.farmName = this.farm?.name
      console.log(this.farm.name)
    }

  }


  getMoney(){
    return this.moneySVC.money$;
  }
  
  getTiles(){
    return this.tilesSVC.tiles$
  }
  
  // JUAN
  //Devuelve los tiles de la granja en concreto
  getTilesByFarm(famrmId:number){
    
    var tilesReturned:Tile[] = [];

    this.tilesSVC._tilesSubject.value.forEach(tile=>
      {
        if(tile.farms.includes(famrmId)){
          tilesReturned.push(tile)
        }
      });

    return tilesReturned
  }


  createFarm(){
    
      this.farmSVC.createFarm(this.newFarmName)
      this.farm = this.farmSVC.selectedFarm;
      
      
      // this.setSelectedFarm(this.farmSVC.getLasFarm())
      // if(this.farmSelected == true){

        if(this.farm){
          this.farmName = this.farm?.name
          
        }

      // }
      console.log(this.farmSVC.getLasFarm())
    }

}
