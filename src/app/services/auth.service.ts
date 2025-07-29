import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Dummy credentials for demo
  private readonly VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  constructor(private router: Router) {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        if (username === this.VALID_CREDENTIALS.username && 
            password === this.VALID_CREDENTIALS.password) {
          
          const user: User = { username, role: 'admin' };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          resolve({ success: true, message: 'Login successful' });
        } else {
          resolve({ success: false, message: 'Invalid username or password' });
        }
      }, 500);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 