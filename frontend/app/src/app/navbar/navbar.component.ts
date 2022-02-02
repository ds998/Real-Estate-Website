import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { RefreshService } from '../services/refresh.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user:User;
  picture:any;

  constructor(public refreshService:RefreshService,public userService:UserService){}

  ngOnInit(){
    if(localStorage.getItem('user')) this.user=JSON.parse(localStorage.getItem("user"));
    else this.user=null;

    this.refreshService.refreshSubmitted.subscribe((des:any)=>{
      this.refresh(des);
    });

    if(this.user!=null){
      this.getPicture(this.user);
    }
  }

  getPicture(user:User){
    this.userService.getProfileImageFromService(this.user.picture, (res)=> {
      this.picture=res;
   }, (err)=>{
      console.log(err);
    });
  }

  refresh(des){
    if(localStorage.getItem('user')) this.user=JSON.parse(localStorage.getItem("user"));
    else this.user=null;
  }

}
