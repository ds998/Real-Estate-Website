import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshService } from '../services/refresh.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router:Router,public refreshService:RefreshService) { }

  ngOnInit(): void {
    
    localStorage.removeItem('user');
    this.logOut();
    this.router.navigate(['/']);
  }

  logOut(){
    this.refreshService.refreshSubmitted.emit('loggedOut');
  }

}
