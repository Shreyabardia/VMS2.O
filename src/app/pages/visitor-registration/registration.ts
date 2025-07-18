import { RouterModule } from '@angular/router';
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
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration.html',
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isSubmitting = false;

  // Visitor photo preview
  photoPreview: string | ArrayBuffer | null = null;

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result;
      reader.readAsDataURL(input.files[0]);
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      idNumber: ['', [Validators.required]],
      company: ['', [Validators.required]],
      designation: [''],
      purpose: ['', [Validators.required]],
      visitDate: ['', [Validators.required]],
      expectedDuration: [''],
      meetingPerson: [''],
      itemsCarried: [''],
      termsAccepted: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', this.registrationForm.value);
        this.isSubmitting = false;

        // Show success message and redirect
        alert('Visitor registered successfully!');
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm() {
    this.registrationForm.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.registrationForm.controls).forEach((key) => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }
}
