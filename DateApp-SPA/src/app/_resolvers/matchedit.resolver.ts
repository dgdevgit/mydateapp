import { Injectable } from "@angular/core";
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class matchedit implements Resolve<User> {
    constructor(private userService: UserService, private alertify: AlertifyService, 
                private router: Router, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.userService.getUser(this.authService.decodeToken.nameid).pipe(
            catchError((error) => {
                this.alertify.error("Unable to retrive profile data");
                this.router.navigate(['/matches'])
                return of(null);
            })
        );
    }
}