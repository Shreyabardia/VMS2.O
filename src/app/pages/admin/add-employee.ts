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
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-employee.html',
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.employeeForm = this.fb.group(
      {
        employeeId: ['', [Validators.required]],
        employeeName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        dateOfBirth: [''],
        dateOfJoining: [''],
        gender: ['male'],
        maritalStatus: ['unmarried'],
        unitName: ['', [Validators.required]],
        department: [''],
        designation: [''],
        role: [''],
        bloodGroup: [''],
        religion: [''],
        address: [''],
        loginName: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Employee added:', this.employeeForm.value);
        this.isSubmitting = false;

        // Show success message and redirect
        alert('Employee added successfully!');
        this.router.navigate(['/admin/edit-user']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetForm() {
    this.employeeForm.reset({
      gender: 'male',
      maritalStatus: 'unmarried',
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private markFormGroupTouched() {
    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }
}
