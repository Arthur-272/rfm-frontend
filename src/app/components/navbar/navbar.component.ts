import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css'],
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    RouterLink
  ]
})
export class NavbarComponent implements OnInit {
  options = [
    { name: 'Live' },
    { name: 'Properties' },
    { name: 'My Report' },
    {name: 'Company Report'},
    { name: 'Logout' },
  ];

  guestOptions = [
    { name: 'Login' },
    { name: 'Register' },
  ];

  isAuthenticated = false;
  menuOpen = false;
  isScrolled = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.renderer.addClass(document.body, 'menu-open');
    } else {
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

  closeMenu() {
    this.menuOpen = false;
    this.renderer.removeClass(document.body, 'menu-open');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  logout() {
    this.authService.removeToken();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  onClick(name: string) {
    switch (name) {
      case 'Login':
        this.router.navigate(['/login']);
        break;
      case 'Register':
        this.router.navigate(['/register']);
        break;
      case 'Logout':
        this.logout();
        break;
      case 'Properties':
        this.router.navigate(['/properties']);
        break;
      case 'My Report':
        this.router.navigate(['/user/report']);
        break;
      case 'Company Report':
        this.router.navigate(['/company/report']);
        break;
      case 'Live':
        this.router.navigate(['/catch/live']);
        break;
    }
    this.closeMenu(); // Close menu after navigation
  }
}
