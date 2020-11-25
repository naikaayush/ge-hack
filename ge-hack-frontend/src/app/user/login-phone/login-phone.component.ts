import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { Router } from '@angular/router';

declare var otp: any;

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.component.html',
  styleUrls: ['./login-phone.component.css'],
})
export class LoginPhoneComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    otp();
  }
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.router.navigate(['signup-data']);
  }
}
