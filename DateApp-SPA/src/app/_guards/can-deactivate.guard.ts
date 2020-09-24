import { Injectable } from "@angular/core";
import { CanDeactivate } from '@angular/router';
import { MatcheditComponent } from '../matches/matchedit/matchedit.component';

@Injectable() 
export class CanDeactivateGuard implements CanDeactivate<MatcheditComponent> {
    constructor() {}
    canDeactivate(component: MatcheditComponent) {
        if (component.ngForm.dirty) {
            return confirm("Are you sure want to continue");            
        }
        return true;
    }
}
