import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: NotificationType = 'info';
  @Input() autoClose: boolean = true;
  @Input() duration: number = 5000;
  @Output() closeEvent = new EventEmitter<void>();

  progress = 100;
  private progressInterval: any;
  private closeTimeout: any;

  ngOnInit() {
    if (this.autoClose) {
      this.startProgress();
      this.closeTimeout = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  close() {
    this.closeEvent.emit();
  }

  private startProgress() {
    const interval = 100; // Update every 100ms
    const totalSteps = this.duration / interval;
    const decrement = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      this.progress -= decrement;
      if (this.progress <= 0) {
        clearInterval(this.progressInterval);
      }
    }, interval);
  }

  getNotificationClasses(): string {
    const baseClasses = 'border-l-4';
    switch (this.type) {
      case 'success':
        return `${baseClasses} border-green-500 bg-green-50`;
      case 'error':
        return `${baseClasses} border-red-500 bg-red-50`;
      case 'warning':
        return `${baseClasses} border-yellow-500 bg-yellow-50`;
      case 'info':
      default:
        return `${baseClasses} border-blue-500 bg-blue-50`;
    }
  }

  getIconClasses(): string {
    switch (this.type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'error':
        return 'fas fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'info':
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  }

  getTitleClasses(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  }

  getMessageClasses(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
      default:
        return 'text-blue-700';
    }
  }

  getProgressBarClasses(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  }
}
