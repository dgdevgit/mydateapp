import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.baseUrl + 'AuthRepository/';
jwt = new JwtHelperService();
decodeToken : any;
constructor(private http: HttpClient) { }

login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((response : any) => {
        const user = response;
        if (user) {
            localStorage.setItem('token', user.token);
            this.decodeToken = this.jwt.decodeToken(user.token);            
        }
      })
    );
}

register(user : User) {  
    return this.http.post(this.baseUrl + 'register', user);
  }

loggedIn() {  
  const token = localStorage.getItem('token');
  return !this.jwt.isTokenExpired(token);
}  
}
