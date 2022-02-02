import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Microlocation } from '../model/microlocation.model';
import { Real_Estate } from '../model/real_estate.model';
import { User } from '../model/user.model';
import { MicrolocationService } from '../services/microlocation.service';
import { RealEstateService } from '../services/real-estate.service';

@Component({
  selector: 'app-json-real-estate',
  templateUrl: './json-real-estate.component.html',
  styleUrls: ['./json-real-estate.component.css']
})
export class JsonRealEstateComponent implements OnInit {

  

  constructor(private router:Router,private mlService:MicrolocationService,private reService:RealEstateService) { }
  
  ngOnInit(): void {
    this.first_step_error=1;
    this.second_step_error=0;
    this.third_step_error=0;
    this.first_step_message="You must upload a file to continue.";
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uploader.onAfterAddingFile = (file)=> { 
      if(!this.name || !this.street){
        this.third_step_error=1;
        this.third_step_message="You can't upload the image before other data(name and street).";
        return;
      }
      console.log(file);
      this.last_name=this.name;
      this.last_street=this.street;
      this.last_microlocation=this.microlocation;
      file.file.name = this.name +'-'+this.street+'-'+this.microlocation+'-'+this.user.username+'-'+(this.after_pictures.length+1).toString()+'-'+file.file.name;
      this.after_pictures.push(file.file.name);
      file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

  json_file:string="";
  after_pictures:Array<string>=[];

  first_step_error:number;
  first_step_message:string;

  second_step_error:number;
  second_step_message:string;

  third_step_error:number;
  third_step_message:string;

  user:User;

  name:string;
  microlocation:string;
  street:string;
  lines:Array<number>;
  area:number;
  type:string;
  rooms:number;
  construction_year:number;
  state:string;
  heating:string;
  floor:number;
  total_floors:number;
  parking:string;
  monthly_utilities:number;
  price:number;
  about:string;
  characteristics:Array<string>;

  URL = 'http://localhost:4000/uploadmulphotos';
  uploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'files'});
  last_name:string;
  last_street:string;
  last_microlocation:string;

  file_change_event(evt:any){
    const fileReader = new FileReader();
    fileReader.readAsText(evt.target.files[0], "UTF-8");
    fileReader.onload = () => {
      this.first_step_error=0;
      this.JSON_check(JSON.parse(fileReader.result.toString()));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  JSON_check(file){
    this.second_step_message="This is not a valid JSON file. The errors are:\n";
    this.second_step_error=0;
    if(!file.name){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'name'.\n";
    }else if(typeof(file.name)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'name' is not of 'string' type.\n";
    }else if(file.name.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'name' is empty.\n";
    }else{
      this.name = file.name;
    }

    

    if(!file.area){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'area'.\n";
    }else if(typeof(file.area)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'area' is not of 'number' type.\n";
    }else if(file.area<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'area' value must be greater than zero.\n";
    }else{
      this.area=file.area;
    }

    let type_checked=false;

    if(!file.type){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'type'.\n";
    }else if(typeof(file.type)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'type' is not of 'string' type.\n";
    }else if(file.type.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'type' is empty.\n";
    }
    else{
      let arr=['Stan','Kuća','Lokal','Vikendica','Magacin'];
      if(!(arr.includes(file.type))){
        this.second_step_error=1;
        this.second_step_message+="\t- The field 'type' value does not correspond to any permitted value.\n";
      }else{
        this.type=file.type;
        type_checked=true;
      }
    }

    if(!file.rooms){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'rooms'.\n";
    }else if(typeof(file.rooms)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'rooms' is not of 'number' type.\n";
    }else if(file.rooms<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'rooms' value must be greater than zero.\n";
    }else{
      this.rooms=file.rooms;
    }

    

    if(!file.construction_year){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'construction_year'.\n";
    }else if(typeof(file.construction_year)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'construction_year' is not of 'number' type.\n";
    }else if(file.construction_year<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'construction_year' value must be greater than zero.\n";
    }else{
      this.construction_year=file.construction_year;
    }

    
    
    if(!file.state){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'state'.\n";
    }else if(typeof(file.type)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'state' is not of 'string' type.\n";
    }else if(file.state.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'state' is empty.\n";
    }
    else{
      
      let states = ['izvorno','renovirano','LUX'];
      if(!(states.includes(file.state))){
        this.second_step_error=1;
        this.second_step_message+="\t- The field 'state' member does not correspond to any permitted value.\n";
      }else{
        this.state=file.state;
      }
    }


    if(!file.heating){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'heating'.\n";
    }else if(typeof(file.heating)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'heating' is not of 'string' type.\n";
    }else if(file.heating.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'heating' is empty.\n";
    }
    else{
      let heatings = ['CG','EG','TA','gas','podno','toplotne pumpe'];
      
        if(!(heatings.includes(file.heating))){
          this.second_step_error=1;
          this.second_step_message+="\t- The field 'heating' member does not correspond to any permitted value.\n";
        }
        else{
          this.heating=file.heating;
        }
    }

    let floor_checked=false;

    if(!file.floor){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'floor'.\n";
    }else if(typeof(file.floor)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'floor' is not of 'number' type.\n";
    }else if(file.floor<0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'floor' value must not be lesser than zero.\n";
    }else if(type_checked && this.type=="Stan" && file.floor<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'floor' value must be greater than zero if the field 'type' value is 'Stan'.\n";
    }else if(type_checked && this.type!="Stan" && file.floor!=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'floor' value must be equal to zero if the field 'type' value is not 'Stan'.\n";
    }
    else{
      this.floor=file.floor;
      floor_checked=true;
    }

    

    if(!file.total_floors){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'total_floors'.\n";
    }else if(typeof(file.total_floors)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'total_floors' is not of 'number' type.\n";
    }else if(file.total_floors<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'total_floors' value must be greater than zero.\n";
    }
    else if(floor_checked && file.total_floors<this.floor){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'total_floors' value must be greater or equal than value of field 'floors'.\n";
    }else{
      this.total_floors=file.total_floors;
    }

    
    if(!file.parking){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'parking'.\n";
    }else if(typeof(file.parking)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'parking' type is not of type 'string'.\n";
    }else if(file.parking.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'parking' is empty.\n";
    }
    else{
      let x=1;
      let parkings = ['Da','Ne'];
      for(let i=0;i<file.parking.length;i++){
        if(!(parkings.includes(file.parking))){
          this.second_step_error=1;
          this.second_step_message+="\t- The field 'parking' member does not correspond to any permitted value.\n";
          x=0;
          break;
        }
      }
      if(x){
        this.parking=file.parking;
      }
    }

    if(!file.monthly_utilities){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'monthly_utilities'.\n";
    }else if(typeof(file.monthly_utilities)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'monthly_utilities' is not of 'number' type.\n";
    }else if(file.monthly_utilities<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'monthly_utilities' value must be greater than zero.\n";
    }else{
      this.monthly_utilities=file.monthly_utilities;
    }

    if(!file.price){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'price'.\n";
    }else if(typeof(file.price)!="number"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'price' is not of 'number' type.\n";
    }else if(file.price<=0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'price' value must be greater than zero.\n";
    }else{
      this.price=file.price;
    }

    if(!file.about){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'about'.\n";
    }else if(typeof(file.about)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'about' is not of 'string' type.\n";
    }else if(file.about.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'about' is empty.\n";
    }else{
      this.about = file.about;
    }

    if(!file.characteristics){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'characteristics'.\n";
    }else if(!Array.isArray(file.characteristics)){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'characteristics' is not of 'array' type.\n";
    }else if(file.characteristics.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'characteristics' is empty.\n";
    }else if(typeof(file.characteristics[0])!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'characteristics' member type is not of type 'string'.\n";
    }
    else{
      let x=1;
      let characteristicss = ['Terasa','Lodja','Francuski balkon','Lift','Podrum','Garaža','Sa baštom','Klima','Internet','Interfon','Telefon'];
      for(let i=0;i<file.characteristics.length;i++){
        if(!(characteristicss.includes(file.characteristics[i]))){
          this.second_step_error=1;
          this.second_step_message+="\t- The field 'characteristics' member does not correspond to any permitted value.\n";
          x=0;
          break;
        }
      }
      if(x){
        this.characteristics=file.characteristics;
      }
    }




    if(!file.microlocation){
      this.second_step_error=1;
      this.second_step_message+="\t- There is no field 'microlocation'.\n";
    }
    else if(typeof(file.microlocation)!="string"){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'microlocation' is not of 'string' type.\n";
    }
    else if(file.microlocation.length==0){
      this.second_step_error=1;
      this.second_step_message+="\t- The field 'microlocation' is empty.\n";
    }
    else{
      this.mlService.get_microlocation(file.microlocation).subscribe((ml:Microlocation)=>{
        if(ml){
          if(!file.street){
            this.second_step_error=1;
            this.second_step_message+="\t- There is no field 'street'.\n";
          }else if(typeof(file.street)!="string"){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'street' is not of 'string' type.\n";
          }else if(file.street.length==0){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'street' is empty.\n";
          }else if(!(ml.streets.includes(file.street))){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'street' value is not found in this microlocation's streets.\n";
          }else{
            this.street=file.street;
          }

          if(!file.lines){
            this.second_step_error=1;
            this.second_step_message+="\t- There is no field 'lines'.\n";
          }else if(!Array.isArray(file.lines)){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'lines' is not of 'array' type.\n";
          }else if(file.lines.length==0){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'lines' is empty.\n";
          }else if(typeof(file.lines[0])!="number"){
            this.second_step_error=1;
            this.second_step_message+="\t- The field 'lines' member type is not of type 'number'.\n";
          }
          else{
            let x=1;
            for(let i=0;i<file.lines.length;i++){
              if(!(ml.lines.includes(file.lines[i]))){
                this.second_step_error=1;
                this.second_step_message+="\t- The field 'lines' member is not found in this microlocation's lines.\n";
                x=0;
                break;
              }
            }
            if(x){
              this.microlocation=file.microlocation;
              this.lines=file.lines;
              if(this.second_step_error==0){
                this.second_step_message="This is a valid JSON file."
              }
            }
          }
        }else{
          this.second_step_error=1;
          this.second_step_message+="\t- The field 'microlocation' does not point to any microlocation in the base.\n";
        }
      });
    }

  }

  submit(){
    if(this.after_pictures.length<3 || this.after_pictures.length>6){
      this.third_step_error=1;
      this.third_step_message="Number of pictures must be in range of 3 to 6.";
      return;
    }



   

    let x = (this.user.agency!="")?"agency":"individual";

    let advertiser={type:x,PIB:this.user.agency,username:this.user.username};

    this.reService.new_real_estate(this.name,this.microlocation,this.street,this.lines,this.area,this.type,this.rooms,this.construction_year,this.state,this.heating,this.floor,this.total_floors,this.parking,this.monthly_utilities,this.price,this.about,this.characteristics,advertiser,this.after_pictures,0,null).subscribe(ob=>{
      if(ob['real_estate']=='ok'){
          if(this.last_name && this.last_name==this.name && this.last_street && this.last_street==this.street){
            this.uploader.uploadAll();
            this.third_step_error=0;
            this.router.navigate(['/advertiser']);
          } else{
            this.third_step_error=1;
            this.third_step_message="You can't upload the image before other data(name and street).";
          }
      }else{
        this.third_step_error=1;
        this.third_step_message="Error with the base.";
      }
    });
  }

  
  

}
