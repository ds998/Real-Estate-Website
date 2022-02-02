import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  constructor(private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.create_table();
  }

  create_table(){
    this.user_entries=new Array();
    this.userService.get_undenied_users().subscribe((users_:User[])=>{
      this.users=users_;
      for(let i=0;i<this.users.length;i++){
        if(this.users[i].approved==1){
          let x = {'username':this.users[i].username,'approve':0,'deny':0,'update':1,'delete':1};
          this.user_entries.push(x);
        }else{
          let x = {'username':this.users[i].username,'approve':1,'deny':1,'update':0,'delete':0};
          this.user_entries.push(x);
        }
      }
      this.dataSource = new MatTableDataSource<any>(this.user_entries);
      this.dataSource.paginator=this.paginator;
    });
  }


  users:User[];
  dataSource:MatTableDataSource<any>;
  displayedColumns=['username','approve','deny','update','delete'];
  @ViewChild('paginator') paginator: MatPaginator;
  user_entries:{'username':string,'approve':number,'deny':number,'update':number,'delete':number}[]=new Array();

  change_approval(username:string,n:number){
    this.userService.change_approval(username,n).subscribe(ob=>{
      this.create_table();
    })
  }

  remove_user(username:string){
    this.userService.remove_user(username).subscribe(ob=>{
      this.create_table();
    })
  }

}
