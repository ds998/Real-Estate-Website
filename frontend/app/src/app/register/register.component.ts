import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Agency } from '../model/agency.model';
import { AgencyService } from '../services/agency.service';
import { CustomValidatorService } from '../services/custom-validator.service';
import { UserService } from '../services/user.service';
import { FileUploader , FileSelectDirective} from 'ng2-file-upload';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form:FormGroup
  loading = false;
  submitted = false;

  constructor(private user_service:UserService, private agency_service:AgencyService, private router:Router,private formBuilder:FormBuilder,private cvService:CustomValidatorService,private el:ElementRef) { }

  ngOnInit(): void {
    this.error=0;
    this.get_all_agencies();
    this.captcha_check=this.randomString(10);
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      surname:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,this.cvService.generalPasswordValid(),this.cvService.bigLetterPasswordValid(),this.cvService.numberPasswordValid(),this.cvService.specialNewPasswordValid()]],
      password_conf:['',Validators.required],
      type:['',Validators.required],
      city:['',Validators.required],
      birthday:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      phone:['',[Validators.required,this.cvService.phone_validity()]],
      picture:['',[Validators.required]],
      agency:[''],
      licence:[0],
      captcha:['',[Validators.required,this.cvService.captcha_valid(this.captcha_check)]]

    },{validator: this.cvService.password_equality()});
    this.uploader.onAfterAddingFile = (file)=> { 
      if(!this.f.username.value){
        this.error=1;
        this.error_message="You can't upload the image before other data(especially username).";
        return;
      }
      file.file.name = this.f.username.value  + '-'+file.file.name;
      this.lastUsername=this.f.username.value;
      this.picture=file.file.name;
      file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
  }
  captcha_check:string;
  error:number;
  error_message:string;

  URL = 'http://localhost:4000/uploadphotos';
  uploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'file'});
  all_agencies:Agency[]=new Array();
  lastUsername:string;
  picture:string;
  width:number;
  height:number;

  get f() { return this.form.controls; }  
  get fe() { return this.form.errors; }

  get_all_agencies(){
    let default_agency=new Agency();
    default_agency.PIB="";
    default_agency.name="No Agency";
    this.all_agencies.push(default_agency);
    this.agency_service.get_all().subscribe((agencies_:Agency[])=>{
      for(let i=0;i<agencies_.length;i++){
        this.all_agencies.push(agencies_[i])
      }
    })

  }

  randomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

  fileChangeEvent(evt:any){
    const URL = window.URL || window.webkitURL;
    const Img = new Image();

    const filesToUpload = (evt.target.files);
    Img.src = URL.createObjectURL(filesToUpload[0]);

    Img.onload = (e: any) => {
      const height = e.path[0].height;
      const width = e.path[0].width;

      console.log(height,width);
      this.height=height;
      this.width=width;
    }
  }

  register(){

    this.submitted=true;
    this.error_message='';
    this.error=0;

    if(this.form.invalid){
      this.captcha_check=this.randomString(10);
      this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
      return;
    }

    if(this.f.agency.value!="" && this.f.licence.value<=0){
      this.error=1;
      this.captcha_check=this.randomString(10);
      this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
      this.error_message="If you are applying for an agency, the licence must be a positive number.";
      return;
    }

    if(this.width<100 || this.width>300 || this.height<100 || this.height>300){
      this.error=1;
      this.captcha_check=this.randomString(10);
      this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
      this.error_message="Picture must be in dimension range (100-300,100-300).";
      return;
    }
    this.loading=true;

    
    this.user_service.register(this.f.name.value,this.f.surname.value,this.f.username.value,this.f.password.value,this.f.type.value,this.f.city.value,this.f.birthday.value,this.f.email.value,this.f.phone.value,this.picture,(this.f.type.value=="advertiser"?this.f.agency.value:""),(this.f.type.value=="advertiser"?this.f.licence.value:0),[],0).subscribe(
      ob=>{
        this.loading=false;
        if(ob['user']=='ok') {
          //let inputElFIles = this.el.nativeElement.querySelector("#file");
          //let count = inputElFIles.files.length;
          if(this.lastUsername && this.lastUsername==this.f.username.value ){
            this.uploader.uploadAll();
            this.error=0;
            this.router.navigate(['/']);
          } else{
            this.error=1;
            this.error_message="You can't upload the image before other data(especially username).";
            this.captcha_check=this.randomString(10);
            this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
          }
        }
        else if(ob['user']=='exists'){
          this.error=1;
          this.error_message="This username is already taken.";
          this.captcha_check=this.randomString(10);
          this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
          
        }
        else if(ob['user']=='email'){
          this.error=1;
          this.error_message="This email address is already in the base.";
          this.captcha_check=this.randomString(10);
          this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
        }
        else if(ob['user']=='agency'){
          this.error=1;
          this.error_message="This licence from this agency has already been taken.";
          this.captcha_check=this.randomString(10);
          this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
        }
        else{
          this.error=1;
          this.error_message="Error with the base.";
          this.captcha_check=this.randomString(10);
          this.f.captcha.setValidators([Validators.required,this.cvService.captcha_valid(this.captcha_check)]);
        }
      }
    )

  }


}
