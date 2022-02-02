import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileUploader } from 'ng2-file-upload';
import { Microlocation } from '../model/microlocation.model';
import { User } from '../model/user.model';
import { MicrolocationService } from '../services/microlocation.service';
import { RealEstateService } from '../services/real-estate.service';


@Component({
  selector: 'app-new-real-estate',
  templateUrl: './new-real-estate.component.html',
  styleUrls: ['./new-real-estate.component.css']
})
export class NewRealEstateComponent implements OnInit {

  form:FormGroup;
  loading = false;
  submitted = false;



  constructor(private formBuilder:FormBuilder,private mlService:MicrolocationService,private reService:RealEstateService,private router:Router,private el:ElementRef) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.get_microlocations();
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      microlocation:['',Validators.required],
      street:['',Validators.required],
      lines:[this.line_selected_items,[Validators.required,Validators.minLength(1)]],
      area:[0,[Validators.required,Validators.min(1)]],
      type:['',Validators.required],
      rooms:[0,[Validators.required,Validators.min(1)]],
      construction_year:[2022,[Validators.required,Validators.min(1)]],
      state:['',[Validators.required]],
      heating:['',[Validators.required]],
      floor:[0],
      total_floors:[0,[Validators.required,Validators.min(1)]],
      parking:['',Validators.required],
      monthly_utilities:[0,[Validators.required,Validators.min(1)]],
      price:[0,[Validators.required,Validators.min(1)]],
      about:["",[Validators.required,Validators.maxLength(500)]],
      characteristics:[this.characteristics_selected_items,[Validators.required,Validators.minLength(1)]],
      pictures:['',[Validators.required]]
      
    });
    this.form.get('microlocation').valueChanges.subscribe(val=>{
      if(val!=""){
        this.line_dropdown_list=[];
        this.streets=[];
        for(let i=0;i<this.microlocations.length;i++){
          if(val==this.microlocations[i]._id){
            for(let j=0;j<this.microlocations[i].lines.length;j++){
              this.line_dropdown_list.push({item_id:(j+1),item_text:this.microlocations[i].lines[j].toString()});
            }
            for(let j=0;j<this.microlocations[i].streets.length;j++){
              this.streets.push(this.microlocations[i].streets[j]);
            }
          }
        }

      }
    });
    this.uploader.onAfterAddingFile = (file)=> { 
      if(!this.f.name.value || !this.f.street.value){
        this.error=1;
        this.error_message="You can't upload the image before other data(name and street).";
        return;
      }
      console.log(file);
      this.last_name=this.f.name.value;
      this.last_street=this.f.street.value;
      this.last_microlocation=this.f.microlocation.value;
      file.file.name = this.f.name.value +'-'+this.f.street.value+'-'+this.f.microlocation.value+"-"+this.user.username+'-'+(this.pictures.length+1).toString()+'-'+file.file.name;
      this.pictures.push(file.file.name);
      file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

  error:number;
  error_message:string="";
  user:User;
  microlocations:Microlocation[];
  last_microlocation:string;
  streets:string[];
  line_dropdown_list=[];
  line_selected_items=[];
  dropdown_settings:IDropdownSettings={
    idField:'item_id',
    textField:'item_text'
  };
  type:Array<string>=["Stan","Kuća","Vikendica","Lokal","Magacin"];
  states:Array<string>=[
    "izvorno",
    "renovirano",
    "LUX",
  ];
  
  heatings=[
    "CG",
    "EG",
    "TA",
    'gas',
    'podno',
    'toplotne pumpe'
  ];
  parking:Array<string>=["Da","Ne"];
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
    {item_id:11,item_text:'Telefon'},
  ];
  characteristics_selected_items=[];
  URL = 'http://localhost:4000/uploadmulphotos';
  uploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'files'});
  pictures=[];
  last_name:string;
  last_street:string;
  get f() { return this.form.controls; } 

  get_microlocations(){
    this.mlService.all_microlocations().subscribe((mls:Microlocation[])=>{
      this.microlocations=mls;
    })
  }

  new_real_estate(){
    this.submitted=true;
    this.error_message='';
    this.error=0;

    if(this.form.invalid){
      return;
    }

    if(this.f.type.value!="Stan" && this.f.floor.value>0){
      this.error=1;
      this.error_message="The floor is only for appartments.";
      return;
    }

    if(this.f.type.value=="Stan" && this.f.floor.value<=0){
      this.error=1;
      this.error_message="The floor must be greater than zero.";
      return;
    }

    if(this.f.floor.value<0){
      this.f.floor.setValue(0);
    }

    if(this.f.floor.value>this.f.total_floors.value){
      this.error=1;
      this.error_message="The floor must be less or equal to the value of total_floors.";
      return;
    }

    if(this.pictures.length<3 || this.pictures.length>6){
      this.error=1;
      this.error_message="Number of pictures must be in range of 3 to 6.";
      return;
    }

    this.loading=true;

    let xlines=[];
    let xcharacteristics=[];

    for(let i=0;i<this.f.lines.value.length;i++){
      xlines.push(+this.f.lines.value[i].item_text);
    }

    for(let i=0;i<this.f.characteristics.value.length;i++){
      xcharacteristics.push(this.f.characteristics.value[i].item_text);
    }

    let x = (this.user.agency!="")?"agency":"individual";

    let advertiser={type:x,PIB:this.user.agency,username:this.user.username};

    this.reService.new_real_estate(this.f.name.value,this.f.microlocation.value,this.f.street.value,xlines,this.f.area.value,this.f.type.value,this.f.rooms.value,this.f.construction_year.value,this.f.state.value,this.f.heating.value,this.f.floor.value,this.f.total_floors.value,this.f.parking.value,this.f.monthly_utilities.value,this.f.price.value,this.f.about.value,xcharacteristics,advertiser,this.pictures,0,null).subscribe(ob=>{
      this.loading=false;
      if(ob['real_estate']=='ok'){
          if(this.last_name && this.last_name==this.f.name.value && this.last_street && this.last_street==this.f.street.value && this.last_microlocation==this.f.microlocation.value){
            this.uploader.uploadAll();
            this.error=0;
            this.router.navigate(['/advertiser']);
          } else{
            this.error=1;
            this.error_message="You can't upload the image before other data(name,street,microlocation).";
          }
      }else{
        this.error=1;
        this.error_message="Error with the base.";
      }
    });
  }





}
