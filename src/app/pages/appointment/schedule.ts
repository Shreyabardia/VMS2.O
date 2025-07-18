import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './schedule.html',
})
export class AppointmentScheduleComponent {
  appointmentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.appointmentForm = this.fb.group({
      visitorType: ['new', [Validators.required]],
      plants: [[], [Validators.required]],
      department: ['', [Validators.required]],
      visitorName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      visitorEmail: ['', [Validators.required, Validators.email]],
      nationality: ['', [Validators.required]],
      designation: [''],
      appointmentFromDate: ['', [Validators.required]],
      appointmentToDate: ['', [Validators.required]],
      appointmentTime: ['12:00', [Validators.required]],
      purposeOfVisit: [''],
      hostName: ['Admin', [Validators.required]],
      hostContact: ['', [Validators.required]],
      meeting: ['', [Validators.required]],
      additionalPerson: [''],
      device: [''],
      maker: [''],
      serialNo: [''],
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Appointment scheduled:', this.appointmentForm.value);
        this.isSubmitting = false;

        // Show success message and redirect
        alert('Appointment scheduled successfully!');
        this.router.navigate(['/appointment/view']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  addItem() {
    // Add logic to handle adding items
    console.log('Adding item...');
  }

  resetForm() {
    this.appointmentForm.reset({
      visitorType: 'new',
      appointmentTime: '12:00',
      hostName: 'Admin',
    });
  }

  onPlantCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    const checked = checkbox.checked;
    const plants = this.appointmentForm.get('plants') as FormArray;
  }

  private markFormGroupTouched() {
    Object.keys(this.appointmentForm.controls).forEach((key) => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }
}
