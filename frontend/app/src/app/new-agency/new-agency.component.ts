import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgencyService } from '../services/agency.service';
import { CustomValidatorService } from '../services/custom-validator.service';

@Component({
  selector: 'app-new-agency',
  templateUrl: './new-agency.component.html',
  styleUrls: ['./new-agency.component.css']
})
export class NewAgencyComponent implements OnInit {

  constructor(private agencyService:AgencyService,private router:Router,private cvService:CustomValidatorService,private formBuilder:FormBuilder) { }

  form:FormGroup;
  loading = false;
  submitted = false;
  error:number;
  error_message:string;

  ngOnInit(): void {
    this.error=0;
    this.form = this.formBuilder.group({
      name :['',Validators.required],
      address:['',Validators.required],
      city:['',Validators.required],
      phone:['',[Validators.required,this.cvService.phone_validity()]],
      PIB:['',[Validators.required,this.cvService.pib_validity()]]
    })
  }

  get f() { return this.form.controls; }  


  new_agency(){
    this.submitted=true;
    this.error_message='';
    this.error=0;

    if(this.form.invalid){
      return;
    }

    this.loading=true;
    this.agencyService.new_agency(this.f.name.value,this.f.address.value,this.f.city.value,this.f.phone.value,this.f.PIB.value).subscribe(ob=>{
      this.loading=false;
      if(ob['agency']=='ok') this.router.navigate(['/administrator']);
      else if(ob['agency']=='exists'){
        this.error=1;
        this.error_message='An agency already exists with that PIB.';
      }else{
        this.error=1;
        this.error_message='Error with the base.';
      }
    })

  }


}
