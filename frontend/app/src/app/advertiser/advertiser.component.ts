import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Real_Estate } from '../model/real_estate.model';
import { RealEstateService } from '../services/real-estate.service';

@Component({
  selector: 'app-advertiser',
  templateUrl: './advertiser.component.html',
  styleUrls: ['./advertiser.component.css']
})
export class AdvertiserComponent implements OnInit {

  constructor(private reService:RealEstateService,private router:Router) { }

  ngOnInit(): void {
    this.username= JSON.parse(localStorage.getItem("user")).username;
    this.create_table();
    setInterval(()=>{this.create_table();},1000*60);
  }

  create_table(){
    this.re_entries=new Array();
    this.reService.real_estates_by_user(this.username).subscribe((res:Real_Estate[])=>{
      this.real_estates=res;
      for(let i=0;i<this.real_estates.length;i++){
        let now = new Date();
        let diff=now.getTime();
        if(this.real_estates[i].change_time)diff-=new Date(this.real_estates[i].change_time).getTime();
        diff/=1000*60*60;
        let hour="yes";
        if(diff<1) hour="no";

        let x = {'_id':this.real_estates[i]._id,'name':this.real_estates[i].name, 'price':this.real_estates[i].price,'sold':this.real_estates[i].selling_month,'hour':hour};
        this.re_entries.push(x);
      }
      this.dataSource = new MatTableDataSource<any>(this.re_entries);
      this.dataSource.paginator=this.paginator;
    });
  }

  username:string;
  real_estates:Real_Estate[];
  dataSource:MatTableDataSource<any>;
  displayedColumns=['name','price','update','sell/sold'];
  @ViewChild('paginator') paginator: MatPaginator;
  re_entries:{'_id':string,'name':string,'price':number,'sold':number,'hour':string}[]=new Array();




  sell_real_estate(_id:string){
    let n = Math.floor(Math.random() * 12 + 1);
    this.reService.sell_real_estate(_id,n).subscribe(ob=>{
      this.create_table();
    })
  }

}
function create_table() {
  throw new Error('Function not implemented.');
}

