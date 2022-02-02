import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'


  get_all(){
    return this.http.get(`${this.uri}/all_agencies`);
  }

  new_agency(name,address,city,phone,PIB){
    const data={
      name:name,
      address:address,
      city:city,
      phone:phone,
      PIB:PIB
    }
    return this.http.post(`${this.uri}/new_agency`,data);
  }

  find_agency(PIB){
    const data={
      PIB:PIB
    }
    return this.http.post(`${this.uri}/find_agency`,data);
  }
}
