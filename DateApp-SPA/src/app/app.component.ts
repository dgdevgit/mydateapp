import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DateApp-SPA';
  jwt = new JwtHelperService();
  constructor(private authService: AuthService) {}

  ngOnInit() {
      const token = localStorage.getItem('token');
      this.authService.decodeToken = this.jwt.decodeToken(token);
  }

}