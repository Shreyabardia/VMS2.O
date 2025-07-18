import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './header.html',
})
export class Header implements OnInit, OnDestroy {
  @Output() toggleMenu = new EventEmitter<void>();
  currentTime = new Date();
  private timeInterval: any;

  constructor() {}

  ngOnInit() {
    // Update time every second
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}
