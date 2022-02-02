import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'


  all_cities(){
    return this.http.get(`${this.uri}/all_cities`);
  }
}
