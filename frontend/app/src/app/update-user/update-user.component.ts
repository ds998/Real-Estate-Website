import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from '../model/agency.model';
import { User } from '../model/user.model';
import { AgencyService } from '../services/agency.service';
import { CustomValidatorService } from '../services/custom-validator.service';
import { UserService } from '../services/user.service';
import { FileUploader , FileSelectDirective} from 'ng2-file-upload';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  form:FormGroup;
  loading = false;
  submitted = false;

  constructor(private route:ActivatedRoute,private router:Router,private userService:UserService,private formBuilder:FormBuilder,private cvService:CustomValidatorService,private agencyService:AgencyService,private el:ElementRef) { }

  ngOnInit(): void {
    this.error=0;
    
    this.get_all_agencies();
    this.form = this.formBuilder.group({
      name:['',Validators.required],
      surname:['',Validators.required],
      password:['',[Validators.required,this.cvService.generalPasswordValid(),this.cvService.bigLetterPasswordValid(),this.cvService.numberPasswordValid(),this.cvService.specialNewPasswordValid()]],
      type:['',Validators.required],
      city:['',Validators.required],
      birthday:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      phone:['',[Validators.required,this.cvService.phone_validity()]],
      picture:[''],
      agency:[''],
      licence:[0]
    });
    this.find_user();
    this.uploader.onAfterAddingFile = (file)=> { 
      console.log(file);
      file.file.name = this.unaltered_user.username  + '-'+file.file.name;
      this.picture=file.file.name;
      file.withCredentials = false; };
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

  get f() { return this.form.controls; } 


  URL = 'http://localhost:4000/uploadphotos';
  uploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'file'});
  all_agencies:Agency[];
  unaltered_user:User=new User();
  lastUsername:string;
  picture:string="";
  width:number;
  height:number;
  updated_img:boolean=false;
  error:number;
  error_message:string;

  find_user(){
    this.userService.find_user(this.route.snapshot.paramMap.get('username')).subscribe((user:User)=>{
      this.unaltered_user=user;
      this.f.name.setValue(this.unaltered_user.name);
      this.f.surname.setValue(this.unaltered_user.surname);
      this.f.password.setValue(this.unaltered_user.password);
      this.f.type.setValue(this.unaltered_user.type);
      this.f.city.setValue(this.unaltered_user.city);
      this.f.birthday.setValue(new Date(this.unaltered_user.birthday));
      this.f.email.setValue(this.unaltered_user.email);
      this.f.phone.setValue(this.unaltered_user.phone);
      this.f.agency.setValue(this.unaltered_user.agency);
      this.f.licence.setValue(this.unaltered_user.licence);
    })
  }

  get_all_agencies(){
    this.all_agencies=new Array();
    let default_agency=new Agency();
    default_agency.PIB="";
    default_agency.name="No Agency";
    this.all_agencies.push(default_agency);
    this.agencyService.get_all().subscribe((agencies_:Agency[])=>{
      for(let i=0;i<agencies_.length;i++){
        this.all_agencies.push(agencies_[i])
      }
    })

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
      this.updated_img=true;
    }
  }

  update_user(){
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

    if(this.updated_img && (this.width<100 || this.width>300 || this.height<100 || this.height>300)){
      this.error=1;
      this.error_message="Picture must be in dimension range (100-300,100-300).";
      return;
    }

    this.loading=true;

    let picture = this.unaltered_user.picture;
    let diff_email=false;
    let diff_agency=false;

    if(this.picture!="") picture = this.picture;

    if(this.f.email.value!=this.unaltered_user.email) diff_email=true;
    if(this.f.type.value=="advertiser" && this.f.agency.value!="" && (this.f.agency.value!=this.unaltered_user.agency || this.f.licence.value!=this.unaltered_user.licence)) diff_agency=true;

    let agency = (this.f.type.value=='advertiser')?this.f.agency.value:"";
    let licence = (this.f.type.value=='advertiser')?this.f.licence.value:0;
    
    this.userService.update_user(this.unaltered_user.username,this.f.name.value,this.f.surname.value,this.f.password.value,this.f.type.value,this.f.city.value,this.f.birthday.value,this.f.email.value,this.f.phone.value,picture,agency,licence,[],1,diff_email,diff_agency).subscribe(
      ob=>{
        this.loading=false;
        if(ob['user']=='ok') {
            if(this.updated_img)this.uploader.uploadAll();
            this.error=0;
            this.router.navigate(['/administrator']);
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
      }
    )
  }

}
