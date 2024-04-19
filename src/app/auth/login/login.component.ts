import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.getLoginStatus()
      ? this.router.navigateByUrl('dashboard')
      : null;
  }

  login() {
    this.authService.login();
    this.router.navigateByUrl('dashboard');
  }
}
