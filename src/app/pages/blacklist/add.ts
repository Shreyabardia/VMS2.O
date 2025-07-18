import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blacklist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.html',
})
export class AddBlacklistComponent {
  blacklistForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.blacklistForm = this.fb.group({
      visitorName: ['', [Validators.required]],
      orderBy: ['', [Validators.required]],
      blacklistDate: [''],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      duration: [''],
      evidence: [''],
      notifySecurity: [false],
      notifyHR: [false],
      notifyManagement: [false],
    });
  }

  onSubmit() {
    if (this.blacklistForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Visitor blacklisted:', this.blacklistForm.value);
        this.isSubmitting = false;

        // Show success message and redirect
        alert('Visitor has been added to blacklist successfully!');
        this.router.navigate(['/blacklist/view']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm() {
    this.blacklistForm.reset({
      notifySecurity: false,
      notifyHR: false,
      notifyManagement: false,
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.blacklistForm.controls).forEach((key) => {
      const control = this.blacklistForm.get(key);
      control?.markAsTouched();
    });
  }
}
