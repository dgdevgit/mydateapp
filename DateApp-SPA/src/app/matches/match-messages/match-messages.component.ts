import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Messages } from 'src/app/_models/messages';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-match-messages',
  templateUrl: './match-messages.component.html',
  styleUrls: ['./match-messages.component.css']
})
export class MatchMessagesComponent implements OnInit {

  messages: Messages[];
  @Input() recipientId: number;
  newMsg: any = {};
  
  constructor(private userService: UserService, 
              private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
      this.loadMessages();
  }

  loadMessages() {
    const currentUser = +this.authService.decodeToken.nameid;
      this.userService.getMessageThread(this.authService.decodeToken.nameid, this.recipientId)
          .pipe(
                tap(msg => {
                    for(let i =0; i < msg.length; i++) {
                        if(msg[i].isRead === false && msg[i].recipientId === currentUser) {
                            this.userService.markAsRead(msg[i].id, currentUser)
                        }
                    }
                })                
            )
          .subscribe(msg => {
              this.messages = msg;
          })
  }

  sendMessage() {
      this.newMsg.recipientId = this.recipientId;
      this.userService.sendMessage(this.authService.decodeToken.nameid, this.newMsg).subscribe((msg: Messages) => {
          this.messages.unshift(msg);
          this.newMsg.content = '';
      }, error => {
          this.alertify.error(error.error);
      })      
  }

}
