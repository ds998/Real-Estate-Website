import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidatorService } from '../services/custom-validator.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  constructor(private user_service:UserService, private router:Router,private formBuilder:FormBuilder,private cvService:CustomValidatorService) { }

  form:FormGroup
  loading = false;
  submitted = false;
  error:number;
  error_message:string;
  username:string;
  old_password_check:string;

  ngOnInit(): void {
    this.error=0;
    this.old_password_check=JSON.parse(localStorage.getItem('user')).password;
    this.username=JSON.parse(localStorage.getItem('user')).username;
    this.form = this.formBuilder.group({
      old_password :['',Validators.required],
      password:['',[Validators.required,this.cvService.generalPasswordValid(),this.cvService.bigLetterPasswordValid(),this.cvService.numberPasswordValid(),this.cvService.specialNewPasswordValid()]],
      password_conf:['',Validators.required]
    },{validator: this.cvService.password_equality()})
  }

  get f() { return this.form.controls; }  
  get fe() { return this.form.errors; }


  change_password(){
    this.submitted=true;
    this.error_message='';
    this.error=0;

    if(this.form.invalid){
      console.log(this.f.old_password.errors);
      console.log(this.f.password.errors);
      console.log(this.f.password_conf.errors);
      return;
    }

    if(this.f.old_password.value!=this.old_password_check){
      this.error=1;
      this.error_message="Old password is not correct.";
      return;
    }
    this.loading=true;

    this.error=0;
    this.user_service.change_password(this.username,this.f.password.value).subscribe(ob=>{
      this.loading=false;
      this.router.navigate(['/logout']);
    })

  }






}
