import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-matchdetail',
  templateUrl: './matchdetail.component.html',
  styleUrls: ['./matchdetail.component.css']
})
export class MatchdetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs : TabsetComponent; 

  constructor(private alertify: AlertifyService, 
              private route: ActivatedRoute) { }
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  ngOnInit() {
    
    this.route.data.subscribe(data => {
        this.user = data['user'];
    })
    
    this.route.queryParams.subscribe(p => {
        const selectedTab = p['tab'];
        this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    })

    this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                thumbnailsColumns: 4,
                imagePercent: 100,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }];
    this.galleryImages = this.getImages(); 
  }

  getImages() {
    const photoUrlList = [];
    for (const p of this.user.photos) {      
      photoUrlList.push({
        small: p.url,
        medium: p.url,
        big: p.url        
      });  
    }
    return photoUrlList;
  }

  selectTab(tabid: number) {
    this.memberTabs.tabs[tabid].active = true;
  }

}
