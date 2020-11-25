import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap } from 'rxjs/operators';
declare var otp: any;
@Component({
  selector: 'app-signup-data',
  templateUrl: './signup-data.component.html',
  styleUrls: ['./signup-data.component.css'],
})
export class SignupDataComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth) {}
  isLoggedIn() {
    return this.afAuth.authState.pipe(first());
  }
  doSomething() {
    this.isLoggedIn()
      .pipe(
        tap((user) => {
          if (user) {
            console.log('Amazing');
            console.log(user);
            // do something
          } else {
            console.log('Brr');
            // do something else
          }
        })
      )
      .subscribe();
  }
  ngOnInit() {
    otp();
    console.log('Hallo');
    this.doSomething();
  }
}
