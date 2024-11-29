import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../config/application-config-service';
import { ILogin } from '../../interface';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiURL: string;

  constructor(
    private http: HttpClient,
    configService: ApplicationConfigService,
    private authService: AuthService
  ) {
    this.apiURL = configService.getResourceURL();
  }

  login(payload: ILogin): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, payload).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          this.authService.setToken(token);
        }
      })
    );
  }

  logout() {
    this.authService.removeToken();
  }
}
