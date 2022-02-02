import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdvertiserComponent } from '../advertiser/advertiser.component';

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'

  empty_microlocation(microloc:string){
    const data={
      microlocation:microloc
    }
    return this.http.post(`${this.uri}/empty_microlocation`,data);
  }

  real_estates_by_user(username:string){
    const data={
      username:username
    }
    return this.http.post(`${this.uri}/real_estates_by_user`,data);
  }

  sell_real_estate(_id:string,n:number){
    const data={
      _id:_id,
      n:n
    }
    return this.http.post(`${this.uri}/sell_real_estate`,data);
  }

  new_real_estate(name,microlocation,street,lines,area,type,rooms,construction_year,state,heating,floor,total_floors,parking,monthly_utilities,price,about,characteristics,advertiser,pictures,selling_month,change_time){
    const data={
      name:name,
      microlocation:microlocation,
      street:street,
      lines:lines,
      area:area,
      type:type,
      rooms:rooms,
      construction_year:construction_year,
      state:state,
      heating:heating,
      floor:floor,
      total_floors:total_floors,
      parking:parking,
      monthly_utilities:monthly_utilities,
      price:price,
      about:about,
      characteristics:characteristics,
      advertiser:advertiser,
      pictures:pictures,
      selling_month:selling_month,
      change_time:change_time
    }
    return this.http.post(`${this.uri}/new_real_estate`,data);
  }

  update_real_estate(_id,name,microlocation,street,lines,area,type,rooms,construction_year,state,heating,floor,total_floors,parking,monthly_utilities,price,about,characteristics,advertiser,pictures,selling_month,change_time){
    const data={
      _id:_id,
      name:name,
      microlocation:microlocation,
      street:street,
      lines:lines,
      area:area,
      type:type,
      rooms:rooms,
      construction_year:construction_year,
      state:state,
      heating:heating,
      floor:floor,
      total_floors:total_floors,
      parking:parking,
      monthly_utilities:monthly_utilities,
      price:price,
      about:about,
      characteristics:characteristics,
      advertiser:advertiser,
      pictures:pictures,
      selling_month:selling_month,
      change_time:change_time
    }
    return this.http.post(`${this.uri}/update_real_estate`,data);
  }


  find_real_estate(_id:string){
    const data={
      _id:_id
    }
    return this.http.post(`${this.uri}/find_real_estate`,data);
  }

  agency_real_estates(PIB:string){
    const data={
      PIB:PIB
    }
    return this.http.post(`${this.uri}/agency_real_estates`,data);
  }

  search(type,locations,price,area,rooms,location_filter,price_filter,area_filter,rooms_filter){
    const data={
      type:type,
      locations:locations,
      price:price,
      area:area,
      rooms:rooms,
      location_filter:location_filter,
      price_filter:price_filter,
      area_filter:area_filter,
      rooms_filter:rooms_filter
    }
    return this.http.post(`${this.uri}/search`,data);
  }


  type_average(microlocation,type){
    const data={
      type:type,
      microlocation:microlocation
    }
    return this.http.post(`${this.uri}/type_average`,data);
  }

  average(microlocation){
    const data={
      microlocation:microlocation
    }
    return this.http.post(`${this.uri}/average`,data);
  }

  getImage(filename){
    return this.http.get(`${this.uri}/downloadphotos/`+filename, {responseType: "blob"});
  }

  getImageFromService(filename, callbackSuccess, callBackErr){
    
    this.getImage(filename).subscribe(res=>{
      let fr = new FileReader();
      fr.addEventListener('load', function(){
        callbackSuccess(fr.result);
      }, false)
      if(res)
      fr.readAsDataURL(res);
    }, err=>{
      console.log('greska');
      callBackErr(err);
    })
  }

  get_last_five(){
    return this.http.get(`${this.uri}/get_last_five`);
  }

  advanced_search(min_price,max_price,min_area,max_area,min_rooms,max_rooms,min_construction_year,max_construction_year,advertiser,state,heating,min_floor,max_floor,min_monthly_utilities,max_monthly_utilities,characteristics){
    const data={
      min_price:min_price,
      max_price:max_price,
      min_area:min_area,
      max_area:max_area,
      min_rooms:min_rooms,
      max_rooms:max_rooms,
      min_construction_year:min_construction_year,
      max_construction_year:max_construction_year,
      advertiser:advertiser,
      state:state,
      heating:heating,
      min_floor:min_floor,
      max_floor:max_floor,
      min_monthly_utilities:min_monthly_utilities,
      max_monthly_utilities:max_monthly_utilities,
      characteristics:characteristics
    }
    return this.http.post(`${this.uri}/advanced_search`,data);
  }
}
