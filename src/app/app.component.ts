import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {AuthInterceptor} from './components/auth/auth.interceptor';
import {HealthCheck} from './components/health-check';


@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'RFM';

  constructor(private healthCheck: HealthCheck) {}

  ngOnInit() {
    this.healthCheck.startPolling();
  }

  ngOnDestroy() {
    this.healthCheck.stopPolling();
  }
}
