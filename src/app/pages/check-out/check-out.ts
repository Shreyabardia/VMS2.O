import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-out.html',
})
export class CheckOutComponent implements OnInit {
  checkoutForm: FormGroup;
  currentDate: string;
  isSubmitting = false;
  visitorDetails: any = null;
  noVisitorFound = false;
  checkoutSuccess = false;
  checkoutTime = '';

  constructor(private fb: FormBuilder) {
    const today = new Date();
    this.currentDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    this.checkoutForm = this.fb.group({
      searchType: ['barcode'],
      searchQuery: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get searchType() {
    return this.checkoutForm.get('searchType');
  }

  get searchQuery() {
    return this.checkoutForm.get('searchQuery');
  }

  searchVisitor() {
    const query = this.searchQuery?.value;
    if (!query) return;

    // Simulate API call to search visitor
    setTimeout(() => {
      // Mock visitor data
      this.visitorDetails = {
        name: 'John Doe',
        company: 'Tech Corp',
        phone: '+91 98765 43210',
        checkInTime: '09:30 AM',
        from: 'Mumbai',
        purpose: 'Business Meeting',
      };
      this.noVisitorFound = false;
    }, 1000);
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.visitorDetails) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        const now = new Date();
        this.checkoutTime = now.toLocaleTimeString();
        this.checkoutSuccess = true;
        this.isSubmitting = false;

        // Reset form after successful checkout
        setTimeout(() => {
          this.checkoutForm.reset({ searchType: 'barcode' });
          this.visitorDetails = null;
          this.checkoutSuccess = false;
        }, 3000);
      }, 2000);
    }
  }
}
