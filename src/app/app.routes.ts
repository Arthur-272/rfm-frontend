import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListPropertiesComponent} from './components/property/list/list.component';
import {DetailPropertyComponent} from './components/property/detail/detail.component';
import {CreatePropertyComponent} from './components/property/create/create.component';
import {CreateVehicleComponent} from './components/vehicle/create/create.component';
import {QuickSearchComponent} from './components/quick-search/quick-search.component';
import {HttpClient} from '@angular/common/http';
import {LoginComponent} from './components/auth/login.component';
import {HomeComponent} from './components/home/home.component';
import {CatchComponent} from './components/catch/catch.component';
import {LiveComponent} from './components/live/live.component';
import {ReportComponent} from './components/report/user-report/report.component';
import {RegisterUserComponent} from './components/register-user/register-user.component';
import {CompanyReportComponent} from './components/report/company-report/company-report.component';
import {AuthGuard} from './components/auth/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterUserComponent },
  { path: 'company/report', component: CompanyReportComponent, canActivate: [AuthGuard] },
  { path: 'catch/live', component: LiveComponent, canActivate: [AuthGuard] },
  { path: 'catch', component: CatchComponent, canActivate: [AuthGuard] },
  { path: 'user/report', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'properties', component: ListPropertiesComponent, canActivate: [AuthGuard] },
  { path: 'property/detail', component: DetailPropertyComponent, canActivate: [AuthGuard] },
  { path: 'property/create', component: CreatePropertyComponent, canActivate: [AuthGuard] },
  { path: 'property/update', component: CreateVehicleComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

  constructor(private http: HttpClient) {

  }


}
