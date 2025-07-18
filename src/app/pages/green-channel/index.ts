import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-green-channel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './green-channel.html',
})
export class GreenChannelComponent implements OnInit {
  greenChannelForm: FormGroup;
  isSubmitting = false;
  currentDateTime = '';
  itemsList: any[] = [];

  constructor(private fb: FormBuilder) {
    this.greenChannelForm = this.fb.group({
      visitorType: ['new', [Validators.required]],
      appointmentType: ['prior', [Validators.required]],
      name: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)],
      ],
      whomToMeet: ['', [Validators.required]],
      idType: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      visitorDesignation: [''],
      organisation: ['', [Validators.required]],
      purposeOfVisit: ['', [Validators.required]],
      noOfVisitors: ['', [Validators.required, Validators.min(1)]],
      visitorPassNo: [''],
      additionalPersons: [''],
      houseNo: [''],
      areaStreet: [''],
      state: [''],
      city: [''],
      pincode: [''],
      device: [''],
      maker: [''],
      serialNo: [''],
      barcode: [''],
    });
  }

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  onSubmit() {
    if (this.greenChannelForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Foreign visitor registered:', this.greenChannelForm.value);
        console.log('Items carried:', this.itemsList);
        this.isSubmitting = false;

        // Show success message and reset form
        alert('Foreign visitor registered successfully!');
        this.resetForm();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  addItem() {
    const device = this.greenChannelForm.get('device')?.value;
    const maker = this.greenChannelForm.get('maker')?.value;
    const serialNo = this.greenChannelForm.get('serialNo')?.value;
    const barcode = this.greenChannelForm.get('barcode')?.value;

    // Check if at least device or maker is provided
    if (!device && !maker) {
      alert('Please enter at least Device or Maker information');
      return;
    }

    // Create new item
    const newItem = {
      id: Date.now(), // Unique ID for removal
      device: device || 'N/A',
      maker: maker || 'N/A',
      serialNo: serialNo || 'N/A',
      barcode: barcode || 'N/A',
    };

    // Add to items list
    this.itemsList.push(newItem);

    // Clear the item fields
    this.greenChannelForm.patchValue({
      device: '',
      maker: '',
      serialNo: '',
      barcode: '',
    });

    console.log('Item added:', newItem);
    console.log('Total items:', this.itemsList);
  }

  removeItem(itemId: number) {
    this.itemsList = this.itemsList.filter((item) => item.id !== itemId);
    console.log('Item removed. Total items:', this.itemsList);
  }

  resetForm() {
    this.greenChannelForm.reset({
      visitorType: 'new',
      appointmentType: 'prior',
    });
    this.itemsList = [];
  }

  private markFormGroupTouched() {
    Object.keys(this.greenChannelForm.controls).forEach((key) => {
      const control = this.greenChannelForm.get(key);
      control?.markAsTouched();
    });
  }
}
