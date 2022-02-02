import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Agency } from '../model/agency.model';
import { Microlocation } from '../model/microlocation.model';
import { Real_Estate } from '../model/real_estate.model';
import { User } from '../model/user.model';
import { AgencyService } from '../services/agency.service';
import { MicrolocationService } from '../services/microlocation.service';
import { RealEstateService } from '../services/real-estate.service';
import { UserService } from '../services/user.service';
import { MatCarousel, MatCarouselComponent } from '@ngbmodule/material-carousel';

@Component({
  selector: 'app-real-estate-details',
  templateUrl: './real-estate-details.component.html',
  styleUrls: ['./real-estate-details.component.css']
})
export class RealEstateDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute,private reService:RealEstateService,private userService:UserService,private agencyService:AgencyService,private mlService:MicrolocationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fill_in_data();
  }

  user:User=null;
  real_estate:Real_Estate=null;
  advertiser:User=null;
  agency:Agency=null;
  microlocation:Microlocation=null;
  average_number:number;
  images:Array<any>=[];
  char_input:any={'Terasa':0,'Lodja':0,'Francuski balkon':0,'Lift':0,'Podrum':0,'Garaža':0,'Sa baštom':0,'Klima':0,'Internet':0,'Interfon':0,'Telefon':0};

  fill_in_data(){
    this.reService.find_real_estate(this.route.snapshot.paramMap.get('_id')).subscribe((real_est:Real_Estate)=>{
      if(real_est){
        this.real_estate=real_est;
        for(let i=0;i<this.real_estate.characteristics.length;i++){
          this.char_input[this.real_estate.characteristics[i]]=1;
        }
        this.mlService.get_microlocation(this.real_estate.microlocation).subscribe((ml:Microlocation)=>{
          this.microlocation=ml;
          this.userService.find_user(this.real_estate.advertiser.username).subscribe((u:User)=>{
            this.advertiser=u;
            if(this.real_estate.advertiser.type=="agency"){
              this.agencyService.find_agency(this.real_estate.advertiser.PIB).subscribe((a:Agency)=>{
                this.agency=a;
              })
            }
          });
          this.reService.average(this.microlocation._id).subscribe((avg_real_ests:Real_Estate[])=>{
            if(avg_real_ests && avg_real_ests.length>0){
              this.average_number=0.0;
              for(let i=0;i<avg_real_ests.length;i++){
                this.average_number+=(avg_real_ests[i].price*1.0)/avg_real_ests[i].area;
              }
              this.average_number/=avg_real_ests.length;
            }
          })
        });
        for(let i=0;i<this.real_estate.pictures.length;i++){
          this.reService.getImageFromService(this.real_estate.pictures[i],(res)=> {
            this.images.push({image:res});
         }, (err)=>{
            console.log(err);
          });
        }
        
        
      }
    })
  }

  favorite(){
    if(this.user.favorites.length<5){
      this.userService.insert_favorite(this.user.username,this.real_estate._id).subscribe(ob=>{

      });
    }
  }

}
