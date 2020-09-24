import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent implements OnInit {

  constructor(private authService: AuthService, private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
      
  }
  @Input() user : User;

  sendLike(id: number)
  {
      this.userService.sendLike(this.authService.decodeToken.nameid, id).subscribe((data) => {
          this.alertify.success("User Liked " + this.user.knownAs);
      }, error => {
          this.alertify.error(error.error);
      });
  }
  
}
