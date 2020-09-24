import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _authService : AuthService, private route: Router,
              private alertify: AlertifyService, private fb: FormBuilder) { }

  user: User;

  @Output() cancelChanges = new EventEmitter();
  registerForm : FormGroup;


  ngOnInit() {
      this.FormRegister();
  }

  FormRegister() {
      this.registerForm = this.fb.group({
          gender: ['male'],
          username: ['', Validators.required],
          knownAs: ['', Validators.required],
          dateofBirth: [null, Validators.required],
          city: ['', Validators.required],
          country: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
          confirmPassword: ['', Validators.required]
      }, {validator: this.matchPassword})
  }

  matchPassword(grp : FormGroup) {
      return grp.get('password').value === grp.get('confirmPassword').value ? null : {'mismatch': true };
  }

  onRegister() : any {
      if(this.registerForm.valid) {
          this.user = Object.assign({}, this.registerForm.value);
          this._authService.register(this.user).subscribe(() => {
              this.alertify.success("Registration is sucessfull");
          }, (error) => {
              this.alertify.error("Registration failed");
          }, () => {
              this._authService.login(this.user).subscribe(() => {
                  this.route.navigate(['/matches']);
              }, (error) => {
                  this.alertify.error("User Login failed due to " + error);
              })
          })
      }
      // this._authService.register(this.model).subscribe(() => {
      //     this.alertify.success("user is registered");
      // }, (error) => {
      //   this.alertify.error("user registration is failed");        
      // })
      console.log(this.registerForm.value);
      
  }

  onCancel() {
    this.cancelChanges.emit(false);
    console.log("user cancelled the changes");    
  }

}
