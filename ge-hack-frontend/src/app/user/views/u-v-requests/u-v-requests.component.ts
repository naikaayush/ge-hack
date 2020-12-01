import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/userFire';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { WebAuthnService } from 'src/app/services/web-authn.service';

@Component({
  selector: 'app-u-v-requests',
  templateUrl: './u-v-requests.component.html',
  styleUrls: ['./u-v-requests.component.css'],
})
export class UVRequestsComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public gen: GeneralService,
    private webAuthnService: WebAuthnService
  ) {}
  uid: any;
  arr: any;
  arr1: any;
  hosp: any;
  stat = false;
  async ngOnInit() {
    const user1 = await this.auth.getUser();
    const uid = user1.uid;
    this.uid = uid;
    console.log('brr');
    this.arr = await this.gen.listReqestsFromUID(this.uid);
  }

  toDateTime(secs) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(secs);
    return d;
  }

  async getMoreInfo(fileId, hId) {
    this.arr1 = await this.gen.getMRecordDetailsFromFileId(fileId);
    this.hosp = await this.gen.getHospitalNameFromUID(hId);
    this.stat = true;
  }

  async approveAccess(id) {
    console.log(id);
    this.webAuthSignin(id);
    return id;
  }

  async webAuthSignin(fileId) {
    this.uid;
    const cityRef = this.auth.afs.collection('users').doc(this.uid);
    const doc = await cityRef.get().toPromise();
    console.log('BR');
    console.log(doc.data());
    const user: User = doc.data();

    const x = {
      email: user.email,
      phone: user.phone,
      credentials: [
        {
          credentialId: user.credentials[0].toUint8Array(),
          publicKey: user.credentials[1].toUint8Array(),
        },
      ],
    };
    const myObjStr = JSON.stringify(x);

    console.log(myObjStr);

    // this.fileId = fileId;
    // const res = await this.http
    //   .get<any>(
    //     'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/getUid?phoneNumber=' +
    //       this.phone
    //   )
    //   .toPromise();

    // console.log(res.uid);
    // const cityRef = this.auth.afs.collection('users').doc(res.uid);
    // const doc = await cityRef.get().toPromise();
    // console.log('BR');
    // console.log(doc.data());
    // const user: User = doc.data();

    // const myObjStr = JSON.stringify(this.x);

    // console.log(myObjStr);
    // const user = this.serverMockService.getUser(this.email);

    this.webAuthnService
      .webAuthnSignin(x)
      .then((response) => {
        // TODO: validate attestion
        alert('✅ Congrats! Authentication went fine!');
        this.gen.grantAccessAPI(fileId);
        // this.x.credentials

        // console.log('SUCCESSFULLY GOT AN ASSERTION!', response);

        //   const responseNew = this.http
        //     .get(
        //       'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/admin/getCustomToken?uid=' +
        //         res.uid,
        //       { responseType: 'text' }
        //     )
        //     .toPromise();

        //   responseNew.then((res) => {
        //     console.log(res);
        //     this.auth.auth.signInWithCustomToken(res);
        //   });
      })
      .catch((error) => {
        alert('🚫 Sorry :( Invalid credentials!');
        console.log('FAIL', error);
      });
  }
}
