import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private http: HttpClient) {}

  async getUIDfromPhone(phone) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/getUid?phoneNumber=';
    return await this.http
      .get<any>(URL + phone)
      .toPromise()
      .then((res) => {
        return res.uid;
      });
  }

  async listMRecordsFromUID(UID) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/views/medicalRecord/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }

  async reqAccessFirebaseUpdate(ownerId, hId, fileId) {
    const headers = { 'Content-Type': 'application/json' };
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/requestAccess';
    const body = { ownerId: ownerId, hospital: hId, mRecord: fileId };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        // this.openSnackBar('Hospital Added', 'Close');
      });
  }

  async listReqestsFromUID(UID) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/views/requests/pending/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }
  async getMRecordDetailsFromFileId(fileId) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/views/mRecordId/';

    console.log(URL + fileId);

    return await this.http
      .get(URL + fileId, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }

  async getHospitalNameFromUID(UID) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/views/getHospitalName/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
  }

  async grantAccessAPI(reqID) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/grantAccess/';

    // console.log(URL + reqID);

    const headers = { 'Content-Type': 'application/json' };
    const body = { requestId: reqID };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        // this.openSnackBar('Hospital Added', 'Close');
      });
  }

  async listGrantedReqestsFromUID(UID) {
    const URL =
      'https://us-central1-ge-medical-block.cloudfunctions.net/webApi/api/v1/user/views/requests/granted/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }
}
