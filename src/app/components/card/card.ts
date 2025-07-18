import { Component, Input, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant: CardVariant = 'default';
  @Input() headerAction = false;
  @Input() footerContent = false;

  @ContentChild('[card-header-action]') headerActionContent: any;
  @ContentChild('[card-footer]') footerContentChild: any;

  getCardClasses(): string {
    const baseClasses = 'transition-all duration-300';

    switch (this.variant) {
      case 'elevated':
        return `${baseClasses} shadow-lg hover:shadow-xl`;
      case 'outlined':
        return `${baseClasses} border-2 border-gray-200 hover:border-gray-300`;
      case 'flat':
        return `${baseClasses} bg-white`;
      case 'default':
      default:
        return `${baseClasses} shadow-sm hover:shadow-md`;
    }
  }
}
