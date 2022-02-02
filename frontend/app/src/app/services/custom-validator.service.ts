import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {
  

  constructor() { }


  generalPasswordValid(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regex = RegExp("^[a-zA-Z][a-zA-Z0-9!@#$%^&*()?_.,]{7,}$");     
  
      if (!regex.test(group.value))
      {        
        return {
          password_not_valid: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  numberPasswordValid(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regexn = /[0-9]/;     
  
      if (!regexn.test(group.value))
      {        
        return {
          password_number_not_valid: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  bigLetterPasswordValid(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regexbl = /[A-Z]/;     
  
      if (!regexbl.test(group.value))
      {        
        return {
          password_bigletter_not_valid: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  specialNewPasswordValid(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regexs = /[!@#$%^&*()?_.,]/;     
  
      if (!regexs.test(group.value))
      {        
        return {
          password_special_not_valid: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  password_equality(){
    return (group: FormGroup): {[key: string]: any} => {                                     
    
      let password = group.value.password;
      let password_conf = group.value.password_conf;          
      
      if (password != password_conf) {
        return {
          mismatchedPasswords: true
        };
      }

      return null;
    }
  }

  phone_validity(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regexph = /[0-9]{10}/;     
  
      if (!regexph.test(group.value))
      {        
        return {
          phone: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  pib_validity(){
    return (group: FormGroup): {[key: string]: any} => {            
      let regexpib = /[0-9]{9}/;     
  
      if (!regexpib.test(group.value))
      {        
        return {
          PIB: true
        };
      }
      else
      {
        return null;        
      }        
    }
  }

  captcha_valid(captcha_check:string){
    return (group: FormGroup): {[key: string]: any} => {                                     
    
      let captcha = group.value;          
      
      if (captcha != captcha_check) {
        return {
          captcha: true
        };
      }

      return null;
    }
  }
}
