import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Real_Estate } from '../model/real_estate.model';
import { User } from '../model/user.model';
import { RealEstateService } from '../services/real-estate.service';
import { RefreshService } from '../services/refresh.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  error : boolean = false;

  constructor(private formBuilder:FormBuilder,private service:UserService, private router:Router,public refreshService:RefreshService,private reService:RealEstateService) { }


  ngOnInit(): void {
    this.attempt=0;
    this.form = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
    this.reService.get_last_five().subscribe((real_ests:Real_Estate[])=>{
      if(real_ests) {
        this.real_estates=real_ests;
        if(this.real_estates.length>0){
          for(let i=0;i<this.real_estates.length;i++){
            let rand=Math.floor(Math.random() * this.real_estates[i].pictures.length);
            this.reService.getImageFromService(this.real_estates[i].pictures[rand],(res)=>{
              this.pictures[this.real_estates[i]._id]=res;
            }, (err)=>{
              console.log(err);
            });
          }
          
        }
      }
    })
  }
  attempt:number;
  message:string;

  real_estates:Real_Estate[];
  pictures:any={};

  get f() {return this.form.controls;}

  login(){
    this.submitted=true;
    this.message='';

    if(this.form.invalid){
      console.log(this.f.username.errors);
      console.log(this.f.password.errors);
      return;
    }
    this.loading=true;


    this.service.login(this.f.username.value,this.f.password.value).subscribe((user: User)=>{
      this.loading=false;
      if(user && user.approved>0){
        this.attempt=0;
        localStorage.setItem('user', JSON.stringify(user));
        //this.logIn();
        if(user.type=='administrator') this.router.navigate(['/administrator']);
        else if(user.type=='buyer') this.router.navigate(['/buyer']);
        else this.router.navigate(['/advertiser']);

        
      }else{
        this.attempt=-1;
        if(!user){
          this.message='Mistake in credentials.';
        }else{
          this.message='The user is not approved by administrator.';
        }
      }
    })
  }

  // logIn() {
  //   this.refreshService.refreshSubmitted.emit('loggedIn');
  // }
}


