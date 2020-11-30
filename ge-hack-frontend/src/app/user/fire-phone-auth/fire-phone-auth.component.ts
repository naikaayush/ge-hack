import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app';
import { User } from '../../interfaces/userFire';

import { WindowService } from 'src/app/services/window.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ServerMockService } from 'src/app/services/server-mock.service';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import * as firebaseadmin from 'firebase-admin';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

class PhoneNumber {
  countryCode: string;
  number: string;

  get e164() {
    const num = this.countryCode + this.number;
    return `${num}`;
  }
}

@Component({
  selector: 'app-fire-phone-auth',
  templateUrl: './fire-phone-auth.component.html',
  styleUrls: ['./fire-phone-auth.component.css'],
})
export class FirePhoneAuthComponent implements OnInit {
  windowRef: any;
  appVerifier: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;

  //BIOMETRIC
  email: string = '';
  name: string = '';
  users: User[];
  useFingerprint = true;
  webAuthnAvailable = !!navigator.credentials && !!navigator.credentials.create;
  cred: any;
  tempUID: any;
  //BIOMETRIC
  db = firebase.firestore();

  constructor(
    public auth: AuthService,
    private win: WindowService,
    //BIOMETRIC
    private serverMockService: ServerMockService,
    private webAuthnService: WebAuthnService,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {
    if (auth.user$) {
      console.log('Logged In');
    } else {
      console.log('Logged Out');
    }
    console.log(auth.user$.subscribe());
  }
  userCollection: AngularFirestoreCollection<User>;
  user: Observable<User[]>;
  data: any;
  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );
    this.windowRef.recaptchaVerifier.render();
    this.phoneNumber.countryCode = '+91';
    this.appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    console.log(this.auth.user$);
    // this.fingerPrintSignUp();
    // this.brr();
    // this.webAuthSignin();
    //   this.userCollection = this.afs.collection('users');
    //   this.user = this.userCollection.snapshotChanges().pipe(
    //     map((actions) =>
    //       actions.map((a) => {
    //         this.data = a.payload.doc.data() as User;
    //         const id = a.payload.doc.id;
    //         return { id, ...this.data };
    //       })
    //     )
    //   );
    //   console.log(this.data);
    //   console.log('brr');
  }

  // userDoc: any;
  // u: any;

  // async brr() {
  //   const a = await this.auth.user$.subscribe((res) => {
  //     this.tempUID = res.uid;
  //     console.log(res.credentials[0].toUint8Array());
  //   });

  // console.log(this.tempUID);
  // }

  // async fingerPrintSignUp() {
  //   console.log('BIO SIGNUP');
  //   // const status = this.auth.auth.currentUser;
  //   const userObj = await this.auth.auth.authState.pipe(first()).toPromise();

  // if (userObj) {
  //   console.log('LOGGED IN');
  //   console.log(userObj.uid);
  //   // User is signed in.
  // } else {
  //   console.log('LOGGED OUT');
  //   // No user is signed in.
  // }

  // Save into the 'DB'
  // const prevUser = this.serverMockService.getUser(this.email);
  // if (prevUser) {
  //   alert('🚫 User already exists with this email address');
  //   return;
  // }

  //   this.auth.updateBioUserData(userObj, this.email, this.name);

  //   // const a = this.auth.getItem(userObj.uid);

  //   const userObjNew = await this.auth.auth.authState.pipe(first()).toPromise();
  //   // console.log(a);

  //   // const user: User = this.serverMockService.addUser({
  //   //   email: this.email,
  //   //   name: this.name,
  //   //   credentials: [],
  //   // });

  //   // this.users = this.serverMockService.getUsers();

  //   // Ask for WebAuthn Auth method
  //   console.log(userObjNew);

  //   if (this.webAuthnAvailable && this.useFingerprint) {
  //     this.webAuthnService
  //       .webAuthnSignup(userObjNew)
  //       .then((credential: PublicKeyCredential) => {
  //         console.log('credentials.create RESPONSE', credential);
  //         // const valid = this.serverMockService.registerCredential(
  //         //   userObjNew,
  //         //   credential
  //         // );
  //         const valid = this.auth.registerCredential(userObjNew, credential);
  //         console.log(userObjNew);
  //         // this.users = this.serverMockService.getUsers();
  //       })
  //       .catch((error) => {
  //         console.log('credentials.create ERROR', error);
  //       });
  //   }
  // }
  // phone = '+919999999999';

  // async webAuthSignin() {
  //   const res = await this.http
  //     .get<any>(
  //       'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/getUid?phoneNumber=' +
  //         this.phone
  //     )
  //     .toPromise();

  //   console.log(res.uid);
  //   const cityRef = this.auth.afs.collection('users').doc(res.uid);
  //   const doc = await cityRef.get().toPromise();
  //   console.log('BR');
  //   console.log(doc.data());
  //   const user: User = doc.data();

  //   const x = {
  //     email: user.email,
  //     phone: user.phone,
  //     credentials: [
  //       {
  //         credentialId: user.credentials[0].toUint8Array(),
  //         publicKey: user.credentials[1].toUint8Array(),
  //       },
  //     ],
  //   };
  //   const myObjStr = JSON.stringify(x);

  //   console.log(myObjStr);
  //   // const user = this.serverMockService.getUser(this.email);
  //   this.webAuthnService
  //     .webAuthnSignin(x)
  //     .then((response) => {
  //       // TODO: validate attestion
  //       alert('✅ Congrats! Authentication went fine!');
  //       console.log('SUCCESSFULLY GOT AN ASSERTION!', response);
  //     })
  //     .catch((error) => {
  //       alert('🚫 Sorry :( Invalid credentials!');
  //       console.log('FAIL', error);
  //     });
  // }
}
