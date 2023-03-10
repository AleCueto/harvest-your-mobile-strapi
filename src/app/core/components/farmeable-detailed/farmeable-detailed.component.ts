import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Farmeable } from '../../models/farmeable.model';

@Component({
  selector: 'app-farmeable-detailed',
  templateUrl: './farmeable-detailed.component.html',
  styleUrls: ['./farmeable-detailed.component.scss'],
})
export class FarmeableDetailedComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();
  @Input('farmeable') set farmeable(farmeable:Farmeable){
    if(farmeable){
      this.form.controls['id'].setValue(farmeable.id);
      this.form.controls['name'].setValue(farmeable.name);
      this.form.controls['amount'].setValue(farmeable.amount);
      this.form.controls['image_beggining'].setValue(farmeable.image_beggining);
      this.form.controls['image_middle'].setValue(farmeable.image_middle);
      this.form.controls['purchase_value'].setValue(farmeable.purchase_value);
      this.form.controls['sale_value'].setValue(farmeable.sale_value);
      this.form.controls['seconds_to_harvest'].setValue(farmeable.seconds_to_harvest);
      this.form.controls['image_end'].setValue(farmeable.image_end);
      if(farmeable.image_end)
        this.currentImage.next(farmeable.image_end);
      this.form.controls.image_end_file.setValue(null);
      this.mode = "Edit";
  }
  }

  constructor(
    private fb:FormBuilder,
    private modal:ModalController,
    private cdr:ChangeDetectorRef
  ) {

    
    this.form = this.fb.group({
      id:[null],
      name:['', [Validators.required]],
      amount:['', [Validators.required]],
      image_beggining:[''],
      image_middle:[''],
      image_end:[''],
      purchase_value:['', [Validators.required]],
      sale_value:['', [Validators.required]],
      seconds_to_harvest:[0],
      image_end_file:[null]
    });

  }

  ngOnInit() {}

  onSubmit(){
    
    this.modal.dismiss({person: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(result:any){
    this.modal.dismiss(null, 'cancel');
  }


  changePic(fileLoader){
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();
      reader.onload = () => {   
        that.currentImage.next(reader.result as string);
        that.cdr.detectChanges();
        that.form.controls.image_end_file.setValue(file);
      };
      reader.onerror = (error) =>{
        console.log(error);
      }
      reader.readAsDataURL(file);
    }
  }

}
