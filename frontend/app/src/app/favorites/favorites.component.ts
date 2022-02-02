import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Real_Estate } from '../model/real_estate.model';
import { User } from '../model/user.model';
import { RealEstateService } from '../services/real-estate.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(private reService:RealEstateService,private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('user')).username;
    this.create_table();
  }

  username:string;
  user:User;
  real_estates:Real_Estate[];
  dataSource:MatTableDataSource<any>;
  displayedColumns=['name','remove'];
  @ViewChild('paginator') paginator: MatPaginator;
  re_entries:{'_id':string,'name':string}[]=new Array();

  create_table(){
    this.re_entries=new Array();
    this.userService.find_user(this.username).subscribe((user_:User)=>{
      if(user_){
        this.user=user_;
        for(let i=0;i<this.user.favorites.length;i++){
          this.reService.find_real_estate(this.user.favorites[i]).subscribe((re:Real_Estate)=>{
            if(re){
              let x = {'_id':re._id,'name':re.name};
              this.re_entries.push(x);
              this.dataSource = new MatTableDataSource<any>(this.re_entries);
              this.dataSource.paginator=this.paginator;
            }
            
          })
        }
      }
    })
    
    
  }

  remove_favorite(_id){
    this.userService.remove_favorite(this.username,_id).subscribe(ob=>{
      if(ob['nModified']==1){
        this.create_table();
      }
    })
  }

  row_link(id){
    let route="buyer/real_estate_details/"+id.toString();
    this.router.navigate([route]);
  }





}
