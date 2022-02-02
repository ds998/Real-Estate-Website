import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChildActivationStart, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { City } from '../model/city.model';
import { Microlocation } from '../model/microlocation.model';
import { Municipality } from '../model/municipality.model';
import { Real_Estate } from '../model/real_estate.model';
import { CityService } from '../services/city.service';
import { MicrolocationService } from '../services/microlocation.service';
import { MunicipalityService } from '../services/municipality.service';
import { RealEstateService } from '../services/real-estate.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {

  form:FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder:FormBuilder,private cityService:CityService,private mpService:MunicipalityService,private mlService:MicrolocationService,private reService:RealEstateService,private router:Router) { }

  ngOnInit(): void {
    this.form_selection();
    this.form=this.formBuilder.group({
      type:['',Validators.required],
      city:[this.city_selected_items],
      municipality:[this.municipality_selected_items],
      microlocation:[this.microlocation_selected_items],
      price:[0],
      area:[0],
      rooms:[0],
    });
    
    
    this.error=0;

  }

  get f() { return this.form.controls; } 

  type:Array<string>=["Stan","Kuća","Vikendica","Lokal","Magacin"];
  rooms:Array<number>=[1,1.5,2,2.5,3,3.5,4,4.5,5];
  dropdown_settings:IDropdownSettings={
    idField:'item_id',
    textField:'item_text'
  };
  city_selected_items=[];
  municipality_selected_items=[];
  microlocation_selected_items=[];
  city_dropdown_list=[];
  municipality_dropdown_list=[];
  microlocation_dropdown_list=[];

  microlocations:Microlocation[];

  dataSource:MatTableDataSource<any>;
  displayedColumns=['name','location','area','rooms','total_floors','about','price','average'];
  @ViewChild('paginator') paginator: MatPaginator;
  re_entries:{'_id':string,'name':string,'location':string,'area':number,'rooms':number,'total_floors':number,'about':string,'price':number,'average':number}[]=new Array();

  error:number;
  error_message:string;

  row_link(id){
    let route="buyer/real_estate_details/"+id.toString();
    this.router.navigate([route]);
  }

  form_selection(){
    this.city_dropdown_list=[];
    this.municipality_dropdown_list=[];
    this.microlocation_dropdown_list=[];
    this.cityService.all_cities().subscribe((cities:City[])=>{
      if(cities){
        let city_list=[];
        let mp_list=[];
        let ml_list=[];
        for(let i=0;i<cities.length;i++){
          city_list.push({item_id:(i+1),item_text:cities[i].name});
        }

        this.mpService.all_municipalities().subscribe((mps:Municipality[])=>{
          if(mps){
            for(let j=0;j<mps.length;j++){
              mp_list.push({item_id:(j+1),item_text:(mps[j].city+" - "+mps[j].name)});
            }

            this.mlService.all_microlocations().subscribe((mls:Microlocation[])=>{
              this.microlocations=mls;
              for(let k=0;k<mls.length;k++){
                ml_list.push({item_id:(k+1),item_text:(mls[k].city + " - "+mls[k].municipality+" - "+mls[k].name)});
              }

              this.city_dropdown_list=city_list;
              this.municipality_dropdown_list=mp_list;
              this.microlocation_dropdown_list=ml_list;
              
              
            })
          }
        })

        
      }
    });
  }

  search(){
    this.submitted=true;
    this.error_message='';
    this.error=0;
    this.re_entries=new Array();
    this.dataSource=null;

    if(this.form.invalid){
      return;
    }

    this.loading=true;

    let location_filter=false;
    let price_filter=false;
    let area_filter=false;
    let rooms_filter=false;

    let microloc=[];


    if(this.f.city.value.length!=0) {
      location_filter=true;
      for(let i=0;i<this.microlocations.length;i++){
        for(let j=0;j<this.f.city.value.length;j++){
          if(this.f.city.value[j].item_text==this.microlocations[i].city){
            microloc.push(this.microlocations[i]._id);
            break;
          }
        }
      }
    }
    if(this.f.municipality.value.length!=0) {
      location_filter=true;
      for(let i=0;i<this.microlocations.length;i++){
        for(let j=0;j<this.f.municipality.value.length;j++){
          if(this.f.municipality.value[j].item_text==this.microlocations[i].city+" - "+this.microlocations[i].municipality){
            if(!(microloc.includes(this.microlocations[i]._id)))microloc.push(this.microlocations[i]._id);
            break;
          }
        }
      }
    }
    if(this.f.microlocation.value.length!=0){
      location_filter=true;
      for(let i=0;i<this.microlocations.length;i++){
        for(let j=0;j<this.f.microlocation.value.length;j++){
          if(this.f.microlocation.value[j].item_text==this.microlocations[i].city+" - "+this.microlocations[i].municipality+" - "+this.microlocations[i].name){
            if(!(microloc.includes(this.microlocations[i]._id)))microloc.push(this.microlocations[i]._id);
            break;
          }
        }
      }
    } 
    if(this.f.price.value!=0) price_filter=true;
    if(this.f.rooms.value!=0) rooms_filter=true;
    if(this.f.area.value!=0) area_filter=true;
    this.reService.search(this.f.type.value,microloc,this.f.price.value,this.f.area.value,this.f.rooms.value,location_filter,price_filter,area_filter,rooms_filter).subscribe((real_ests:Real_Estate[])=>{
      this.loading=false;
      if(real_ests && real_ests.length>0){
        for(let i=0;i<real_ests.length;i++){
          this.reService.type_average(real_ests[i].microlocation,real_ests[i].type).subscribe((avg_real_ests:Real_Estate[])=>{
            let avg=0.0;
            if(avg_real_ests && avg_real_ests.length>0){
              avg=0.0;
              for(let j=0;j<avg_real_ests.length;j++){
                avg+=(avg_real_ests[j].price*1.0)/avg_real_ests[j].area;
              }
              avg /= avg_real_ests.length;
              let k=-1;
              for(let j=0;j<this.microlocations.length;j++){
                if(this.microlocations[j]._id==real_ests[i].microlocation){
                  k=j;
                  break;
                }
              }
              let x = {_id:real_ests[i]._id,name:real_ests[i].name,location:this.microlocations[k].city+" - "+this.microlocations[k].municipality+" - "+this.microlocations[k].name,area:real_ests[i].area,rooms:real_ests[i].rooms,total_floors:real_ests[i].total_floors,about:real_ests[i].about,price:real_ests[i].price,average:avg};
              this.re_entries.push(x);
              this.dataSource = new MatTableDataSource<any>(this.re_entries);
              this.dataSource.paginator=this.paginator;
            }
          })
        }
        
        
      }else{
        this.error=1;
        this.error_message="No real estates found.";
      }
    })

  }
  
}
