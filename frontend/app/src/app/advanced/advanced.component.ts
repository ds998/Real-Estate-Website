import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Microlocation } from '../model/microlocation.model';
import { Real_Estate } from '../model/real_estate.model';
import { MicrolocationService } from '../services/microlocation.service';
import { RealEstateService } from '../services/real-estate.service';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {

  form:FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder:FormBuilder,private reService:RealEstateService,private router:Router,private mlService:MicrolocationService) { }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      min_price:[0],
      max_price:[0],
      min_area:[0],
      max_area:[0],
      min_rooms:[0],
      max_rooms:[0],
      min_construction_year:[0],
      max_construction_year:[0],
      advertiser:[this.advertiser_selected_items],
      state:[this.state_selected_items],
      heating:[this.heating_selected_items],
      min_floor:[0],
      max_floor:[0],
      min_monthly_utilities:[0],
      max_monthly_utilities:[0],
      characteristics:[this.characteristics_selected_items]
    });
    this.error=0;
    this.mlService.all_microlocations().subscribe((mls:Microlocation[])=>{
      this.microlocations=mls;
    })

  }

  get f() { return this.form.controls; } 

  dropdown_settings:IDropdownSettings={
    idField:'item_id',
    textField:'item_text'
  };
  advertiser_selected_items=[];
  state_selected_items=[];
  heating_selected_items=[];
  characteristics_selected_items=[];
  advertiser_dropdown_list=[
    {item_id:1,item_text:'Agencija'},
    {item_id:2,item_text:'Vlasnik'},
  ];
  state_dropdown_list=[
    {item_id:1,item_text:'izvorno'},
    {item_id:2,item_text:'renovirano'},
    {item_id:3,item_text:'LUX'}
  ];
  heating_dropdown_list=[
    {item_id:1,item_text:'CG'},
    {item_id:2,item_text:'EG'},
    {item_id:3,item_text:'TA'},
    {item_id:4,item_text:'gas'},
    {item_id:5,item_text:'podno'},
    {item_id:6,item_text:'toplotne pumpe'}
  ];
  characteristics_dropdown_list=[
    {item_id:1,item_text:"Terasa"},
    {item_id:2,item_text:"Lodja"},
    {item_id:3,item_text:"Francuski balkon"},
    {item_id:4,item_text:'Lift'},
    {item_id:5,item_text:'Podrum'},
    {item_id:6,item_text:'Garaža'},
    {item_id:7,item_text:"Sa baštom"},
    {item_id:8,item_text:"Klima"},
    {item_id:9,item_text:"Internet"},
    {item_id:10,item_text:'Interfon'},
    {item_id:11,item_text:'Telefon'}
  ];

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

  search(){
    this.submitted=true;
    this.error_message='';
    this.error=0;
    this.re_entries=new Array();
    this.dataSource=null;

    if(this.form.invalid){
      return;
    }

    let form_touched=false;
    if(this.f.min_price.value!=0){
      form_touched=true;
    }
    if(this.f.max_price.value!=0){
      form_touched=true;
    }
    if(this.f.min_area.value!=0){
      form_touched=true;
    }
    if(this.f.max_area.value!=0){
      form_touched=true;
    }
    if(this.f.min_rooms.value!=0){
      form_touched=true;
    }
    if(this.f.max_rooms.value!=0){
      form_touched=true;
    }
    if(this.f.min_construction_year.value!=0){
      form_touched=true;
    }
    if(this.f.max_construction_year.value!=0){
      form_touched=true;
    }
    if(this.f.advertiser.value.length!=0){
      form_touched=true;
    }
    if(this.f.state.value.length!=0){
      form_touched=true;
    }
    if(this.f.heating.value.length!=0){
      form_touched=true;
    }
    if(this.f.min_floor.value!=0){
      form_touched=true;
    }
    if(this.f.max_floor.value!=0){
      form_touched=true;
    }
    if(this.f.min_monthly_utilities.value!=0){
      form_touched=true;
    }
    if(this.f.max_monthly_utilities.value!=0){
      form_touched=true;
    }
    if(this.f.characteristics.value.length!=0){
      form_touched=true;
    }

    if(!form_touched){
      this.error=1;
      this.error_message="Nothing was entered.";
      return;
    }

    if(this.f.min_price.value>this.f.max_price.value && this.f.max_price.value!=0){
      this.error=1;
      this.error_message="Minimum price is bigger than maximum price.";
      return;
    }
    if(this.f.min_area.value>this.f.max_area.value && this.f.max_area.value!=0){
      this.error=1;
      this.error_message="Minimum area is bigger than maximum area.";
      return;
    }
    if(this.f.min_rooms.value>this.f.max_rooms.value && this.f.max_rooms.value!=0){
      this.error=1;
      this.error_message="Minimum rooms is bigger than maximum rooms.";
      return;
    }
    if(this.f.min_construction_year.value>this.f.max_construction_year.value && this.f.max_construction_year.value!=0){
      this.error=1;
      this.error_message="Minimum construction_year is bigger than maximum construction_year.";
      return;
    }
    if(this.f.min_floor.value>this.f.max_floor.value && this.f.max_floor.value!=0){
      this.error=1;
      this.error_message="Minimum floor is bigger than maximum floor.";
      return;
    }
    if(this.f.min_monthly_utilities.value>this.f.max_monthly_utilities.value && this.f.max_monthly_utilities.value!=0){
      this.error=1;
      this.error_message="Minimum monthly_utilities is bigger than maximum monthly_utilities.";
      return;
    }

    this.loading=true;

    let xadvertiser=[];
    if(this.f.advertiser.value.length!=0){
      for(let i=0;i<this.f.advertiser.value.length;i++){
        if(this.f.advertiser.value[i].item_text=="Agencija"){
          xadvertiser.push("agency");
        }
        if(this.f.advertiser.value[i].item_text=="Vlasnik"){
          xadvertiser.push("individual");
        }
      }
    }

    let xstate=[];
    if(this.f.state.value.length!=0){
      for(let i=0;i<this.f.state.value.length;i++){
        xstate.push(this.f.state.value[i].item_text);
      }
    }

    let xheating=[];
    if(this.f.heating.value.length!=0){
      for(let i=0;i<this.f.heating.value.length;i++){
        xheating.push(this.f.heating.value[i].item_text);
      }
    }

    let xcharacteristics=[];
    if(this.f.characteristics.value.length!=0){
      for(let i=0;i<this.f.characteristics.value.length;i++){
        xcharacteristics.push(this.f.characteristics.value[i].item_text);
      }
    }

    this.reService.advanced_search(this.f.min_price.value,this.f.max_price.value,this.f.min_area.value,this.f.max_area.value,this.f.min_rooms.value,this.f.max_rooms.value,this.f.min_construction_year.value,this.f.max_construction_year.value,xadvertiser,xstate,xheating,this.f.min_floor.value,this.f.max_floor.value,this.f.min_monthly_utilities.value,this.f.max_monthly_utilities.value,xcharacteristics).subscribe((real_ests:Real_Estate[])=>{
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
