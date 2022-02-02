import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agency } from '../model/agency.model';
import { Real_Estate } from '../model/real_estate.model';
import { User } from '../model/user.model';
import { AgencyService } from '../services/agency.service';
import { CustomValidatorService } from '../services/custom-validator.service';
import { RealEstateService } from '../services/real-estate.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  form:FormGroup;
  loading = false;
  submitted=false;

  constructor(private formBuilder:FormBuilder,private cvService:CustomValidatorService,private agency_service:AgencyService,private userService:UserService,private reService:RealEstateService) { }

  ngOnInit(): void {
    this.get_all_agencies();
    this.form=this.formBuilder.group({
      phone:['',[Validators.required,this.cvService.phone_validity()]],
      email:['',[Validators.required,Validators.email]],
      agency:[''],
      licence:['']
    });
    this.user_info();
  }

  user:User;
  all_agencies:Agency[];
  error:number;
  error_message:string;
  birthday:Date;

  //public barChartData=[];

  get f(){return this.form.controls;}

  user_info(){
    this.user=JSON.parse(localStorage.getItem('user'));
    this.birthday=new Date(this.user.birthday);
    this.f.phone.setValue(this.user.phone);
    this.f.email.setValue(this.user.email);
    this.f.agency.setValue(this.user.agency);
    this.f.licence.setValue(this.user.licence);
    // if(this.user.agency!=""){
    //   this.reService.agency_real_estates(this.user.agency).subscribe((real_ests:Real_Estate[])=>{
    //     let nums = Array(12).fill(0);
    //     for(let i=0;i<real_ests.length;i++){
    //       if(real_ests[i].selling_month!=0){
    //         nums[real_ests[i].selling_month-1]+=1;
    //       }
    //     }

    //     for(let i=0;i<12;i++){
    //       let x:any={};
    //       x['id']=i;
    //       x['label_name']=(i+1).toString();
    //       for(let j=0;j<12;j++){
    //         x["value"+(j+1).toString()]=0;
    //       }
    //       x["value"+(i+1).toString()]=nums[i];
    //       this.barChartData.push(x);
    //     }
    //   });
    // }
  }

  get_all_agencies(){
    this.all_agencies=new Array();
    let default_agency=new Agency();
    default_agency.PIB="";
    default_agency.name="No Agency";
    this.all_agencies.push(default_agency);
    this.agency_service.get_all().subscribe((agencies_:Agency[])=>{
      for(let i=0;i<agencies_.length;i++){
        this.all_agencies.push(agencies_[i]);
      }
    })

  }

  update_advertiser(){
    this.submitted=true;
    this.error_message='';
    this.error=0;

    if(this.form.invalid){
      return;
    }

    if(this.f.agency.value!="" && this.f.licence.value<=0){
      this.error=1;
      this.error_message="If you are applying for an agency, the licence must be a positive number.";
      return;
    }
    this.loading=true;

    let diff_phone=false;
    let diff_email=false;
    let diff_agency=false;

    if(this.f.phone.value!=this.user.phone) diff_phone=true;
    if(this.f.agency.value!=this.user.agency) diff_agency=true;
    if(this.f.email.value!=this.user.email) diff_email=true;

    this.userService.update_advertiser(this.user.username,this.f.phone.value,this.f.email.value,this.f.agency.value,this.f.licence.value,diff_email,diff_phone,diff_agency).subscribe(
      ob=>{
        this.loading=false;
        if(ob['user']=='ok') {
            this.userService.find_user(this.user.username).subscribe((user_:User)=>{
              if(user_){
                localStorage.setItem('user',JSON.stringify(user_));
                this.user_info();
              }else{
                this.error=1;
                this.error_message="Error with the base.";
              }
            })
        }
        else if(ob['user']=='exists'){
          this.error=1;
          this.error_message="This user exists already(same username).";
        }
        else if(ob['user']=='email'){
          this.error=1;
          this.error_message="This email address is already in the base.";
        }
        else if(ob['user']=='agency'){
          this.error=1;
          this.error_message="This licence from this agency has already been taken.";
        }
        else{
          this.error=1;
          this.error_message="Error with the base.";
        }
      })

  }



}
