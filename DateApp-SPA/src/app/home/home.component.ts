import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  isRegistermode = false

  ngOnInit() {
  }

  openRegister() {
    this.isRegistermode = true;
  }

  onCancelChange(isreg: boolean) {
    this.isRegistermode = isreg;
  }

}
