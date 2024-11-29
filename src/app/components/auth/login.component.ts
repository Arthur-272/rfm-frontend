import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login.service';
import {ILogin} from '../../interface';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgClass,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Model to bind to the form inputs
  loginData: ILogin = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  // Submit the login form
  onSubmit(): void {
    // Reset error message
    this.errorMessage = null;

    // Check if username and password are provided
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.loading = true;

    // Call the login service
    this.loginService.login(this.loginData).subscribe({
      next: (response) => {
        // On successful login, navigate to the home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Handle login errors
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
