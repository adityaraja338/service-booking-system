import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isUserLoggedIn: boolean = true;

  constructor(private router: Router) {}

  getLoginStatus() {
    return this.isUserLoggedIn;
  }

  login() {
    this.isUserLoggedIn = true;
  }

  logout() {
    this.isUserLoggedIn = false;
    return this.router.navigateByUrl('/login');
  }
}
