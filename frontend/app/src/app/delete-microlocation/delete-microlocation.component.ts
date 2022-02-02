import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Microlocation } from '../model/microlocation.model';
import { Real_Estate } from '../model/real_estate.model';
import { MicrolocationService } from '../services/microlocation.service';
import { RealEstateService } from '../services/real-estate.service';

@Component({
  selector: 'app-delete-microlocation',
  templateUrl: './delete-microlocation.component.html',
  styleUrls: ['./delete-microlocation.component.css']
})
export class DeleteMicrolocationComponent implements OnInit {

  constructor(private microlocService:MicrolocationService,private reService:RealEstateService) { }

  ngOnInit(): void {
    this.create_table();
  }


  dataSource:MatTableDataSource<any>;
  displayedColumns=['username','municipality','city','delete'];
  @ViewChild('paginator') paginator: MatPaginator;
  microloc_entries:{'_id':string,'name':string,'municipality':string,'city':string}[]=new Array();

  create_table(){
    this.microloc_entries=new Array();
    this.microlocService.all_microlocations().subscribe((mls:Microlocation[])=>{
      for(let i=0;i<mls.length;i++){
        this.reService.empty_microlocation(mls[i]._id).subscribe((obj:Real_Estate[])=>{
          if(obj.length==0){
            this.microloc_entries.push({'_id':mls[i]._id,'name':mls[i].name,'municipality':mls[i].municipality,'city':mls[i].city});
          }
          if(i==mls.length-1){
            this.dataSource = new MatTableDataSource<any>(this.microloc_entries);
            this.dataSource.paginator=this.paginator;
          }
        });
      }
      
    });
    
  }

  remove_microloc(_id:string){
    this.microlocService.delete_microlocation(_id).subscribe(ob=>{
      this.create_table();
    });
  }



}
