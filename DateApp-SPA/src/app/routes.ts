import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MatchesComponent } from './matches/matches.component';
import { AuthGuard } from './_guards/auth.guard';
import { MatchdetailComponent } from './matches/matchdetail/matchdetail.component';
import { matchesdetails } from './_resolvers/matchesdetails.resolver';
import { matchdetails } from './_resolvers/matchdetails.resolver';
import { MatcheditComponent } from './matches/matchedit/matchedit.component';
import { matchedit } from './_resolvers/matchedit.resolver';
import { CanDeactivateGuard } from './_guards/can-deactivate.guard';
import { lists } from './_resolvers/lists.resolver';
import { messages } from './_resolvers/messages.resolver';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        children: [
            { path: 'matches', component: MatchesComponent, resolve: { userData: matchesdetails}},
            { path: 'matches/:id', component: MatchdetailComponent, resolve: { user: matchdetails }},
            { path: 'match/edit', component: MatcheditComponent, resolve: { user: matchedit }, 
                                    canDeactivate: [CanDeactivateGuard] },
            { path: 'messages', component: MessagesComponent, resolve: { messages: messages} },
            { path: 'list', component: ListsComponent, resolve: { userData: lists} }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
] 

