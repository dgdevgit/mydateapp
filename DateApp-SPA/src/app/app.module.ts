import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { JwtModule } from "@auth0/angular-jwt";
import { TabsModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import {TimeAgoPipe} from 'time-ago-pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HandleInterceptor } from "./_services/handle.interceptor";
import { MessagesComponent } from './messages/messages.component';
import { MatchesComponent } from './matches/matches.component';
import { ListsComponent } from './lists/lists.component';
import { appRoutes } from './routes';
import { RouterModule } from '@angular/router';
import { MatchCardComponent } from './matches/match-card/match-card.component';
import { MatchdetailComponent } from './matches/matchdetail/matchdetail.component';
import { matchesdetails } from './_resolvers/matchesdetails.resolver';
import { matchdetails } from './_resolvers/matchdetails.resolver';
import { MatcheditComponent } from './matches/matchedit/matchedit.component';
import { matchedit } from './_resolvers/matchedit.resolver';
import { CanDeactivateGuard } from './_guards/can-deactivate.guard';
import { AuthGuard } from './_guards/auth.guard';
import { PhotoEditorComponent } from './matches/photo-editor/photo-editor.component';
import { lists } from './_resolvers/lists.resolver';
import { messages } from './_resolvers/messages.resolver';
import { MatchMessagesComponent } from './matches/match-messages/match-messages.component';

export function TokenGetter() {
   return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig  {
   overrides = {
       pinch: { enable: false },
       rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MessagesComponent,
      MatchesComponent,
      ListsComponent,
      MatchCardComponent,
      MatchdetailComponent,
      MatcheditComponent,
      PhotoEditorComponent,
      TimeAgoPipe,
      MatchMessagesComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      PaginationModule.forRoot(),
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      ButtonsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot({
         config: {
            tokenGetter: TokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/AuthRepository']
         }
      }),
      NgxGalleryModule,
      FileUploadModule
   ],
   providers: [
      AuthService,
      AuthGuard,
      matchesdetails,
      matchdetails,
      matchedit,
      lists,
      messages,
      CanDeactivateGuard,
      {
         provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig 
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
