import { Component } from '@angular/core';
import { RefreshService } from './services/refresh.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user=localStorage.getItem('user');

  constructor(public refreshService:RefreshService){}

  ngOnInit(){
    this.refreshService.refreshSubmitted.subscribe((des:any)=>{
      this.refresh(des);
    });
  }

  refresh(des){
    this.user=localStorage.getItem('user');
  }
}
