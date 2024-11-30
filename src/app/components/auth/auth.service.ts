import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IRegister, IUser} from '../../interface';
import {response} from 'express';
import {ApplicationConfigService} from '../../config/application-config-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwtToken';

  private apiURL;

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private appConfigService: ApplicationConfigService) {
    this.apiURL = appConfigService.getResourceURL();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.tokenKey, token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }

  removeToken(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser() && this.getToken() !== null;
  }

  getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiURL}/user`);
  }

  register (payload: IUser): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, payload);

  }
}
