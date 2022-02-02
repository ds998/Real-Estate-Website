import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MicrolocationService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'


  mp_microloc(city:string,municipality:string){
    const data={
      city:city,
      municipality:municipality
    }
    return this.http.post(`${this.uri}/mp_microloc`,data);
  }

  new_microlocation(name:string,city:string,municipality:string,streets:Array<string>,lines:Array<number>){
    const data={
      name:name,
      city:city,
      municipality:municipality,
      streets:streets,
      lines:lines
    }
    return this.http.post(`${this.uri}/new_microlocation`,data);
  }

  all_microlocations(){
    return this.http.get(`${this.uri}/all_microlocations`);
  }

  delete_microlocation(_id:string){
    const data={
      _id:_id
    }
    return this.http.post(`${this.uri}/delete_microlocation`,data);
  }

  get_microlocation(_id:string){
    const data={
      _id:_id
    }
    return this.http.post(`${this.uri}/get_microlocation`,data);
  }


}
