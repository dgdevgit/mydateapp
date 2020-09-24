/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatcheditComponent } from './matchedit.component';

describe('MatcheditComponent', () => {
  let component: MatcheditComponent;
  let fixture: ComponentFixture<MatcheditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatcheditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatcheditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
