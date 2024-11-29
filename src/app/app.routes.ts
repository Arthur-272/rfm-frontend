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


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterUserComponent},
  {path: 'company/report', component: CompanyReportComponent},
  {path: 'catch/live', component: LiveComponent},
  {path: 'catch', component: CatchComponent},
  {path: 'user/report', component: ReportComponent},
  {path: 'properties', component: ListPropertiesComponent},
  {path: 'property/detail', component: DetailPropertyComponent},
  {path: 'property/create', component: CreatePropertyComponent},
  {path: 'property/update', component: CreateVehicleComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

  constructor(private http: HttpClient) {

  }


}
