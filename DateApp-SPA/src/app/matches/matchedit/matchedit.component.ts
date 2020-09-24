import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-matchedit',
  templateUrl: './matchedit.component.html',
  styleUrls: ['./matchedit.component.css']
})
export class MatcheditComponent implements OnInit {
  
  user: User;
  @ViewChild('editForm', {static: true}) ngForm : NgForm;    
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.ngForm.dirty) {
        $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
              private userService: UserService, private authService: AuthService) { }
  ngOnInit() {
      this.route.data.subscribe(data => {
          this.user = data['user'];
      })
  }

  updateUser() {
    this.userService.updateUserDetails(this.authService.decodeToken['nameid'], this.user).subscribe((next) => {
      this.alertify.success("Data updated successfully");
      this.ngForm.reset(this.user);
    }, (error) => {
        this.alertify.error("Error while updating the data" +error)
    })
  }

  updateMainPhoto(photUrl) {
      this.user.photoUrl = photUrl;
  }

}
