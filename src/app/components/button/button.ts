import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outline'
  | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() rightIcon?: string;
  @Input() fullWidth = false;

  @Output() clickEvent = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.clickEvent.emit(event);
    }
  }

  getButtonClasses(): string {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300';
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();
    const widthClasses = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${widthClasses}`.trim();
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'xl':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  }

  private getVariantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:ring-green-500';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 focus:ring-yellow-500';
      case 'info':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-500';
      case 'outline':
        return 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500';
      case 'ghost':
        return 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500';
    }
  }

  getIconClasses(): string {
    const sizeClasses = this.getIconSizeClasses();
    return `${sizeClasses} mr-2`;
  }

  getRightIconClasses(): string {
    const sizeClasses = this.getIconSizeClasses();
    return `${sizeClasses} ml-2`;
  }

  private getIconSizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      case 'xl':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  }

  getLabelClasses(): string {
    return this.icon || this.rightIcon ? '' : '';
  }
}
