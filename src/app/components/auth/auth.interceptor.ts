import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedUrls = ['login'];
    if (excludedUrls.some(url => request.url.includes(url))) {
      return next.handle(request);
    }
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    } else {
      this.router.navigate(['login']);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("Interceptor Error:", error); // Debugging: Log full error object
        if (error.status === 401 || error.status === 403) {
          console.log("Unauthorized or Forbidden Error"); // Should print if condition matches
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
        return throwError(error); // Ensure the error is rethrown for further handling
      })
    );
  }
}
