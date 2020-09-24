import { Component, OnInit } from '@angular/core';
import { Messages } from '../_models/messages';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    constructor(private route: ActivatedRoute, private userService: UserService, 
                private alertify: AlertifyService, private authService: AuthService) { }
    
    messages: Messages[];
    pageRes: Pagination;
    messageContainer = 'unread';
    
    ngOnInit() {
        this.route.data.subscribe(res => {
            this.messages = res['messages'].result;
            this.pageRes = res['messages'].pageResult;
        })        
    }        

    pageChanged(event: any) {
        this.pageRes.currentPage = event.page;
        this.loadMessages();
    }

    loadMessages() {
        this.userService.getMessages(this.authService.decodeToken.nameid, 
                          this.pageRes.currentPage, this.pageRes.itemsPerPage, this.messageContainer.toLowerCase())
            .subscribe((res: PaginatedResult<Messages[]>) => {
                this.messages = res.result;
                this.pageRes = res.pageResult;
            },
            error => {
                this.alertify.error(error)
            })
    }

    deleteMessage(id: number) {
        this.alertify.confirm("Are you sure want to delete the message", () => {
            this.userService.deleteMessage(id, this.authService.decodeToken.nameid).subscribe(() => {
                this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
                this.alertify.success("Message deleted");
            }, error => {
                this.alertify.error(error.error);
            })
        })
    }
    
}
