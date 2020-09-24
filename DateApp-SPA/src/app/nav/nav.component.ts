import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(public authService : AuthService, private alertify: AlertifyService,
                private router: Router) { }

  ngOnInit() {
  }

  login(): any {
    this.authService.login(this.model).subscribe(next => {
        this.alertify.success("Login Successful");
        },(error) => {
          this.alertify.error("Login Failed with the error "+error);
        }, () => {
          this.router.navigate(['/matches']);
        });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  loggedOut() {
    localStorage.removeItem('token');
    this.alertify.message("User Logged out");
    this.router.navigate(['/home']);
  }

}
