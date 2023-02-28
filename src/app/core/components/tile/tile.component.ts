import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../../models/tile.model';
import { CoreModule } from '../../core.module';
import { FarmeablesService } from '../../services/farmeables.service';
import { Farmeable } from '../../models/farmeable.model';
import { ModalController } from '@ionic/angular';

//ERROR: NO ENTIENDO POR QUE NO ME LO IMPORTA DEL CORE
import { TileDetailComponent } from '../tile-detail/tile-detail.component';
import { TilesService } from '../../services/tiles.service';

import * as moment from 'moment-timezone';
import { BehaviorSubject, ignoreElements, map, Observable, take, takeWhile } from 'rxjs';
import { MoneyService } from '../../services/money.service';
import { Farm } from '../../models/farm.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {

  // @Input() tileInput:Tile | undefined;
  @Input('tileInput') set tileInput(t:Tile){
    this._tile = t;
    this.loadFarmeable(t);

    // if(this.tileInput.idFarmeable != 6){
    // this.loadFarmeable(t);
    // }
  }

  private async loadFarmeable(t:Tile){
    console.log(await this.farmeableSVC.getFarmeableById(t.idFarmeable))
    this._farmeable.next(await this.farmeableSVC.getFarmeableById(t.idFarmeable));
  }  
  get tileInput():Tile{
    return this._tile;
  }


  private _tile:Tile;
  public isPlanted:Boolean;
  private _farmeable:BehaviorSubject<Farmeable> = new BehaviorSubject<Farmeable>(null);
  farmeable$:Observable<Farmeable> = this._farmeable.asObservable();
  constructor(
    private farmeableSVC:FarmeablesService,
    private tileSVC:TilesService,
    private modal:ModalController,
    private moneySVC:MoneyService,

    ) { 

      // this.loadFarmeable(this.tileInput)

    }

  ngOnInit() {

    //COMPROBAR QUE DATOS TENGO AQUI Y SI NO LOS TENGO INTENTAR ASIGNAR EL FARMEABLE$ AQUI

    if(this.tileInput.idFarmeable != 6){
      // this.loadFarmeable(this.tileInput)
      // console.log(this._farmeable.value)
    }
  }
  


  // farmeableActual:Farmeable;

  async itemClicked(){
    console.log("werfwefwref")
    //ABRIR MODAL EN EL QUE ELEGIR EL FARMEABLE
    // console.log(this.tileSVC._tile.find(i=>i.id == this.tileInput?.id))
    if(this.tileInput!=undefined){
      
      var tile = this.tileSVC._tilesSubject.value.find(i=>i.id == this.tileInput?.id)
      
      // await (await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).name == null || await (await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).name == undefined

      if(tile.idFarmeable == null || tile.idFarmeable == undefined || tile.idFarmeable == 6){
        this.presentForm()
      } else{
        if(tile?.canRecolect){
          this.moneySVC.earnMoney(await (await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).sale_value)
          this.cleanTile(tile)
        }else{
          console.log("Está lleno y no puedes recoger")

          // HAY QUE QUITARLO
          this.moneySVC.earnMoney(await (await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).sale_value)
          this.cleanTile(tile)
        }
      }

      this.loadFarmeable(this.tileInput)

    }
    // console.log("Has clicado la casilla número " + this.tileInput?.id)
    // if(this.tileInput != undefined){
    //   this.setFarmeable(this.farmeableSVC._farmeable.find(i => {return i.name == "puerro"})!);
    // }

  }

  cleanTile(tile:Tile){
    tile.idFarmeable = 6;
    tile.canRecolect = false

    // this.tileSVC.updateTile(tile)
  }

  deleteTile(tile:Tile | undefined){
    if(tile)
    this.tileSVC.deleteTile(tile.id)
  }

  async setFarmeable(farmeable:Farmeable){

    this.isPlanted = true
    // this.tileInput!.farmeable = this.farmeableSVC._farmeable.find(i => {return i.name == "puerro"})!;
    var tile = this.tileSVC._tilesSubject.value.find(i=>i.id == this.tileInput?.id)
    
    // var farmeableLocal;

    if(this.tileInput != undefined){

      // farmeableLocal = {
        
        //   id:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).id,
        //   name:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).name,
        //   seconds_to_harvest:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).seconds_to_harvest,
        //   purchase_value:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).purchase_value,
        //   sale_value:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).sale_value,
        //   amount:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).amount,
        //   image_beggining:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).image_beggining,
        //   image_middle:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).image_middle,
        //   image_end:(await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).image_end,
        
        // }
        
        // this.farmeableActual = farmeableLocal
        
      tile!.idFarmeable = farmeable.id;
      console.log(tile?.id + " |" + tile?.idFarmeable)
      tile!.createAt = moment();
      // this.tileSVC.updateTile(tile)
      this.loadFarmeable(this.tileInput)
      // tile!.image = tile!.farmeable.image_beggining
      // console.log(tile)

      //TIEMPO
      // var moment_to_harvest = tile?.createAt?.add((await this.farmeableSVC.getFarmeableById(tile.idFarmeable)).seconds_to_harvest, "seconds")




    }
    // this.tileInput!.farmeable = farmeable;



    //TIEMPO 

    // var index = 1

    // console.log(farmeableLocal.name)

    // //Creation observable to control time
    // var time_farming = this.tileSVC.actual_time
    // .pipe(take(farmeableLocal.seconds_to_harvest || 1));

    // time_farming.subscribe(
    //   {
    //     next(_moment:moment.Moment){
          
    //       if(tile!.idFarmeable){

    //       if(_moment.isAfter(moment_to_harvest)){
    //         console.log("Puedes recoger: " + farmeableLocal.name)
    //         //IMAGEN 
    //         // tile!.image = tile!.farmeable.image_end
    //         tile!.canRecolect = true;
    //       }
    //       else if(index > farmeableLocal.seconds_to_harvest/2){
    //       // console.log(_moment.toISOString(), moment_to_harvest?.toISOString());
    //       // console.log("Estoy dentro");

    //       // IMAGEN
    //       // tile!.image = tile!.farmeable.image_middle
    //       }
          
    //     }
    //         //console.log(tile?.create_date?.add(tile?.farmeable?.days_to_harvest, "seconds"))
    //         console.log("contador para recoger " + farmeableLocal.name + ":" + index)
    //         index++
    //     }
    //   }
    // )
  }


  async presentForm(){
    const modal = await this.modal.create({
      component:TileDetailComponent
    })
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result){
        console.log(result.data)
        this.setFarmeable(result.data)
      }

    });


  }

}
