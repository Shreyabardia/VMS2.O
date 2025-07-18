import {
  Component,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() isMobileMenuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  openDropdown: string | null = null;

  private leaveTimeout: any;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
  ) {}

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
    // TODO: Implement logout logic
    console.log('Logout clicked from navbar');
    // Example: Navigate to login page after logout
    // this.router.navigate(['/login']);
  }
}
