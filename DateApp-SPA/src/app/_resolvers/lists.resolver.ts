import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class lists implements Resolve<User[]> {
    constructor(private userService: UserService, private alertify: AlertifyService, 
            private router: Router) {}

    pageNumber = 1;
    pageSize = 5;
    likeParam = 'Liker';

    resolve(): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, this.likeParam)
            .pipe(
                catchError(error => {
                    this.alertify.error("Error fetching the data");
                    this.router.navigateByUrl('[/home]');
                    return of(null);
                })
            );
    }
}