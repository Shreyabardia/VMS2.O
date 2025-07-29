import {
  Component,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  @Input() isMobileMenuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  openDropdown: string | null = null;
  currentUser: User | null = null;

  private leaveTimeout: any;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleDropdown(dropdown: string) {
    if (this.openDropdown === dropdown) {
      this.openDropdown = null;
    } else {
      this.openDropdown = dropdown;
    }
  }

  mouseEnter(dropdown: string) {
    clearTimeout(this.leaveTimeout);
    this.openDropdown = dropdown;
  }

  mouseLeave() {
    this.leaveTimeout = setTimeout(() => {
      this.openDropdown = null;
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openDropdown = null;
    }
  }

  closeMobileMenu() {
    this.closeMenu.emit();
  }

  logout() {
    this.authService.logout();
  }
}
