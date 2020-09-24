import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private authService: AuthService, private alertify: AlertifyService,
              private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {      
      this.route.data.subscribe(data => {
          this.users = data['userData'].result;
          this.pagination = data['userData'].pageResult;
      })
      this.likesParam = 'Liker';
  }

  pageChanged(event: any) {
      this.pagination.currentPage = event.page;
      this.LoadNextUsers();
  }

  LoadNextUsers() {
      this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.likesParam)
          .subscribe((res: PaginatedResult<User[]>) => {
              this.users = res.result;
              this.pagination = res.pageResult;
        },
        error => {
            this.alertify.error(error.error)
        })
  }



}
