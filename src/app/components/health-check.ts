import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApplicationConfigService} from '../config/application-config-service';

@Injectable({
  providedIn: 'root'
})
export class HealthCheck {
  private interval$ = new BehaviorSubject<number>(0);
  private apiURL: string;

  constructor(private http: HttpClient, private appConfigService: ApplicationConfigService) {
    this.apiURL = appConfigService.getResourceURL();
  }

  startPolling() {
    this.interval$.next(0); // Start polling
    this.interval$.subscribe(() => {
      this.sendKeepAliveRequest();
    });
  }

  stopPolling() {
    this.interval$.complete(); // Stop polling
  }

  private sendKeepAliveRequest() {
    this.http.get(`${this.apiURL}/health-check`).subscribe({
      next: (response) => console.log('Keep-alive successful:', response),
      error: (error) => console.error('Keep-alive failed:', error),
    });
  }
}
