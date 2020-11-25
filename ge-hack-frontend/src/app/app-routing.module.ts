import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPhoneComponent } from './user/login-phone/login-phone.component';
import { SignupDataComponent } from './user/signup-data/signup-data.component';

const routes: Routes = [
  { path: 'login', component: LoginPhoneComponent },
  { path: 'signup-data', component: SignupDataComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
