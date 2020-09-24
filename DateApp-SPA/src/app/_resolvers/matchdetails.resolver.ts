import { Injectable } from "@angular/core";
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()

export class matchdetails implements Resolve<User> {
    constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.userService.getUser(route.params['id']).pipe(
            catchError((error) => {
                this.alertify.error("Unable to retrive data");
                this.router.navigate(['/matches'])
                return of(null);
            })
        );
    }
}