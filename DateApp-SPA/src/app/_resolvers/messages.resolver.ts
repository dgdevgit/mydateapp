import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Messages } from '../_models/messages';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class messages implements Resolve<Messages[]> {
    constructor(private authService: AuthService, private userService: UserService, 
                private alertify: AlertifyService, private router: Router) {}

    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'unread';

    resolve(): Observable<Messages[]> {
        return this.userService.getMessages(this.authService.decodeToken.nameid, 
                                        this.pageNumber, this.pageSize, this.messageContainer.toLowerCase())
            .pipe(
                catchError(error => {
                    this.alertify.error("Error fetching the data");
                    this.router.navigateByUrl('[/home]');
                    return of(null);
                })
            );
    }
}