import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // In AuthService
private loggedIn = new BehaviorSubject<boolean>(
  !!localStorage.getItem('userId') || 
  !!localStorage.getItem('role') ||
  !!localStorage.getItem('username')
);// Read from localStorage
  isLoggedIn$ = this.loggedIn.asObservable(); // Observable to track login state

  constructor() {}

  setLoginStatus(status: boolean) {
    this.loggedIn.next(status); // Update login status
  }
}