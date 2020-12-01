import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmindashComponent } from './admin/admindash/admindash.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { HDashComponent } from './hospital/h-dash/h-dash.component';
import { HLoginComponent } from './hospital/h-login/h-login.component';
import { FirePhoneAuthComponent } from './user/fire-phone-auth/fire-phone-auth.component';
import { LoginPhoneComponent } from './user/login-phone/login-phone.component';
import { UserDashComponent } from './user/user-dash/user-dash.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserSignUpComponent } from './user/user-sign-up/user-sign-up.component';
import { UVRequestsComponent } from './user/views/u-v-requests/u-v-requests.component';
import { UserMedRecordsComponent } from './user/views/user-med-records/user-med-records.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'login', component: LoginPhoneComponent },
  { path: 'phone', component: FirePhoneAuthComponent },
  { path: 'admin-dash', component: AdmindashComponent },
  { path: 'admin-login', component: AdminloginComponent },
  { path: 'user-signup', component: UserSignUpComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'user/dash', component: UserDashComponent },
  { path: 'user/dash/mRecord', component: UserMedRecordsComponent },
  { path: 'hospital/login', component: HLoginComponent },
  { path: 'hospital/dash', component: HDashComponent },
  { path: 'user/dash/viewPendingReq', component: UVRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
