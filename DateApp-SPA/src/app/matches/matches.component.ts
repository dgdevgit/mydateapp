import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { PaginatedResult, Pagination } from '../_models/Pagination';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

    constructor(private route: ActivatedRoute, private userService: UserService, private alertify: AlertifyService) { }
    users: User[];
    pageRes: Pagination;
    
    ngOnInit() {
        this.route.data.subscribe(data => {
            this.users = data['userData'].result;
            this.pageRes = data.userData.pageResult;            
        });
    }
    
    
    pageChanged(event: any) {
        this.pageRes.currentPage = event.page;
        this.LoadNextUsers();
    }

    LoadNextUsers() {
        this.userService.getUsers(this.pageRes.currentPage, this.pageRes.itemsPerPage)
            .subscribe((res: PaginatedResult<User[]>) => {
                this.users = res.result;
                this.pageRes = res.pageResult;
            },
            error => {
                this.alertify.error(error)
            })
    }
}
