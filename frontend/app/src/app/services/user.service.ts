import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000'

  login(username,password){
    const data={
      username:username,
      password:password
    }

    return this.http.post(`${this.uri}/login`,data);

  }

  change_password(username,new_password){
    const data={
      username:username,
      password:new_password
    }

    return this.http.post(`${this.uri}/change_password`,data);
  }

  register(name,surname,username,password,type,city,birthday,email,phone,picture,agency,licence,favorites,approved){
    const data={
      name:name,
      surname:surname,
      username:username,
      password:password,
      type:type,
      city:city,
      birthday:birthday,
      email:email,
      phone:phone,
      picture:picture,
      agency:agency,
      licence:licence,
      favorites:favorites,
      approved:approved
    }

    return this.http.post(`${this.uri}/register`,data);

  }

  change_approval(username:string,n:number){
    const data={
      username:username,
      n:n
    }

    return this.http.post(`${this.uri}/change_approval`,data);
  }

  remove_user(username:string){
    const data={
      username:username
    }

    return this.http.post(`${this.uri}/remove_user`,data);
  }

  get_undenied_users(){

    return this.http.get(`${this.uri}/undenied_users`);
  }

  find_user(username:string){
    const data={
      username:username
    }

    return this.http.post(`${this.uri}/find_user`,data);
  }

  update_user(username,name,surname,password,type,city,birthday,email,phone,picture,agency,licence,favorites,approved,diff_email,diff_agency){
    const data={
      name:name,
      surname:surname,
      username:username,
      password:password,
      type:type,
      city:city,
      birthday:birthday,
      email:email,
      phone:phone,
      picture:picture,
      agency:agency,
      licence:licence,
      favorites:favorites,
      approved:approved,
      diff_email:diff_email,
      diff_agency:diff_agency
    }

    return this.http.post(`${this.uri}/update_user`,data);

  }

  update_advertiser(username,phone,email,agency,licence,diff_email,diff_phone,diff_agency){
    const data={
      username:username,
 
      email:email,
      phone:phone,

      agency:agency,
      licence:licence,

      diff_email:diff_email,
      diff_agency:diff_agency,
      diff_phone:diff_phone
    }

    return this.http.post(`${this.uri}/update_advertiser`,data);

  
  }

  getProfileImage(filename){
    return this.http.get(`${this.uri}/downloadphotos/`+filename, {responseType: "blob"});
  }

  getProfileImageFromService(filename, callbackSuccess, callBackErr){
    
      this.getProfileImage(filename).subscribe(res=>{
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

  insert_favorite(username:string,_id:string){
    const data={
      username:username,
      _id:_id
    }
    return this.http.post(`${this.uri}/insert_favorite`,data);
  }

  remove_favorite(username:string,_id:string){
    const data={
      username:username,
      _id:_id
    }
    return this.http.post(`${this.uri}/remove_favorite`,data);
  }

}
