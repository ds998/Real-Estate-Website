import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'


  city_municipalities(city:string){
    const data={
      city:city
    }
    return this.http.post(`${this.uri}/city_municipalities`,data);
  }

  all_municipalities(){
    return this.http.get(`${this.uri}/all_municipalities`);
  }
}
