import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  passwordStrength: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  passwordValidator(control: any) {
    const value = control.value;
    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const valid =
      hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;
    if (!valid) {
      return { weakPassword: true };
    }
    return null;
  }

  get password() {
    return this.registerForm.get('password');
  }

  onPasswordInput() {
    const value = this.password?.value || '';
    if (value.length < 8) {
      this.passwordStrength = 'Too short';
    } else if (this.password?.hasError('weakPassword')) {
      this.passwordStrength = 'Weak password';
    } else {
      this.passwordStrength = 'Strong password';
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          window.alert("Registration Successful!");
          // Handle success (e.g., navigate to login)
        },
        (error) => {
          window.alert("Registration Failed");
          // Handle error
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
