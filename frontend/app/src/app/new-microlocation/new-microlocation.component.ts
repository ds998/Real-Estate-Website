import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { City } from '../model/city.model';
import { Microlocation } from '../model/microlocation.model';
import { Municipality } from '../model/municipality.model';
import { CityService } from '../services/city.service';
import { MicrolocationService } from '../services/microlocation.service';
import { MunicipalityService } from '../services/municipality.service';

@Component({
  selector: 'app-new-microlocation',
  templateUrl: './new-microlocation.component.html',
  styleUrls: ['./new-microlocation.component.css']
})
export class NewMicrolocationComponent implements OnInit {

  constructor(private router:Router,private cityService:CityService,private mpService:MunicipalityService,private microlocService:MicrolocationService,private formBuilder:FormBuilder) { }

  form:FormGroup;
  submitted:boolean=false;
  loading:boolean=false;
  line_dropdown_list=[];
  line_selectedItems=[];
  line_dropdownSettings:IDropdownSettings={
    idField:'item_id',
    textField:'item_text'
  };

  all_cities:City[];
  municipalities:Municipality[];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      city:['',Validators.required],
      municipality:['',Validators.required],
      streets:['',Validators.required],
      lines:[this.line_selectedItems,Validators.required]
      
    });
    this.form.get('city').valueChanges.subscribe(val=>{
      if(val!=""){
        this.get_city_municipalities();

      }
    });
    this.form.get('municipality').valueChanges.subscribe(val=>{
      this.line_dropdown_list=[];
      if(val!=""){
        for(let i=0;i<this.municipalities.length;i++){
          if(val==this.municipalities[i].name){
            for(let j=0;j<this.municipalities[i].lines.length;j++){
              this.line_dropdown_list.push({item_id:(j+1),item_text:this.municipalities[i].lines[j].toString()});
            }
          }
        }

      }
    });
    this.get_all_cities();
  }

  get f() { return this.form.controls; }  

  get_all_cities(){
    this.cityService.all_cities().subscribe((cities:City[])=>{
      this.all_cities=cities;

    });
  }

  get_city_municipalities(){
    this.mpService.city_municipalities(this.f.city.value).subscribe((mps:Municipality[])=>{
      this.municipalities=mps;

    });
  }

  new_microlocation(){
    this.submitted=true;

    if(this.form.invalid){
      return;
    }

    this.loading=true;

    let streets=this.f.streets.value.split(',');
    let lines=[];
    for(let i=0;i<this.f.lines.value.length;i++){
      lines.push(+this.f.lines.value[i].item_text);
    }

    this.microlocService.new_microlocation(this.f.name.value,this.f.city.value,this.f.municipality.value,streets,lines).subscribe(ob=>{
      this.loading=false;
      if(ob['microlocation']=='ok')this.router.navigate(['/administrator']);
      else if(ob['microlocation']=='exists')console.log('A microlocation exists with the same name in this municipality.');
      else console.log('Error with the base.');
    })


  }

}
