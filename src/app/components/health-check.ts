import {interval, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApplicationConfigService} from '../config/application-config-service';

@Injectable({
  providedIn: 'root'
})
export class HealthCheck {
  private subscription: Subscription | undefined;
  private apiURL: string;

  constructor(private http: HttpClient, private appConfigService: ApplicationConfigService) {
    this.apiURL = appConfigService.getResourceURL();
  }

  startPolling() {
    // Interval emits every 2 minutes (120000 ms)
    if (this.subscription) {
      console.warn('Polling already started');
      return;
    }

    this.subscription = interval(120000).subscribe(() => {
      this.sendKeepAliveRequest();
    });
  }

  stopPolling() {
    if (this.subscription) {
      console.log('Stopping polling');
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  private sendKeepAliveRequest() {
    this.http.get(`${this.apiURL}/health-check`).subscribe({
      next: (response) => console.log('Keep-alive successful:', response),
      error: (error) => console.error('Keep-alive failed:', error),
    });
  }
}
