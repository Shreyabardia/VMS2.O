import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
