import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  refreshSubmitted = new EventEmitter<string>();

  constructor() { }
}
