import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-on-gate-appointment-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './on-gate-appointment-status.html',
})
export class OnGateAppointmentStatusComponent implements OnInit {
  onGateFilterForm: FormGroup;
  appointmentFilterForm: FormGroup;
  onGateData: any[] = [];
  filteredOnGateData: any[] = [];
  appointmentData: any[] = [];
  filteredAppointmentData: any[] = [];

  constructor(private fb: FormBuilder) {
    this.onGateFilterForm = this.fb.group({
      name: [''],
      companyName: [''],
      phoneNo: [''],
      status: [''],
    });
    this.appointmentFilterForm = this.fb.group({
      name: [''],
      mobileNo: [''],
      appointmentWith: [''],
      nationality: [''],
      status: [''],
      unitName: [''],
      approver: [''],
    });
  }

  ngOnInit(): void {
    // Mock data for demonstration
    this.onGateData = [
      { name: 'John Doe', companyName: 'Acme Corp', phoneNo: '9876543210', status: 'Waiting' },
      { name: 'Jane Smith', companyName: 'Beta Ltd', phoneNo: '9876543211', status: 'Checked In' },
      { name: 'Carlos Ruiz', companyName: 'Gamma Inc', phoneNo: '9876543212', status: 'Waiting' },
      { name: 'Priya Patel', companyName: 'Delta LLC', phoneNo: '9876543213', status: 'Checked In' },
    ];
    this.filteredOnGateData = this.onGateData;
    this.onGateFilterForm.valueChanges.subscribe(() => this.applyOnGateFilters());

    this.appointmentData = [
      { name: 'Alice Brown', mobileNo: '9876543212', appointmentWith: 'Manager', nationality: 'Indian', status: 'Approved', unitName: 'Unit 1', approver: 'Admin' },
      { name: 'Bob White', mobileNo: '9876543213', appointmentWith: 'HR', nationality: 'American', status: 'Pending', unitName: 'Unit 2', approver: 'Supervisor' },
      { name: 'Chen Li', mobileNo: '9876543214', appointmentWith: 'Director', nationality: 'Chinese', status: 'Approved', unitName: 'Unit 3', approver: 'Director' },
      { name: 'Fatima Noor', mobileNo: '9876543215', appointmentWith: 'CEO', nationality: 'Pakistani', status: 'Rejected', unitName: 'Unit 4', approver: 'CEO' },
    ];
    this.filteredAppointmentData = this.appointmentData;
    this.appointmentFilterForm.valueChanges.subscribe(() => this.applyAppointmentFilters());
  }

  applyOnGateFilters() {
    const filters = this.onGateFilterForm.value;
    this.filteredOnGateData = this.onGateData.filter((row) => {
      const nameMatch = filters.name ? row.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const companyMatch = filters.companyName ? row.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) : true;
      const phoneMatch = filters.phoneNo ? row.phoneNo.includes(filters.phoneNo) : true;
      const statusMatch = filters.status ? row.status.toLowerCase().includes(filters.status.toLowerCase()) : true;
      return nameMatch && companyMatch && phoneMatch && statusMatch;
    });
  }

  applyAppointmentFilters() {
    const filters = this.appointmentFilterForm.value;
    this.filteredAppointmentData = this.appointmentData.filter((row) => {
      const nameMatch = filters.name ? row.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const mobileMatch = filters.mobileNo ? row.mobileNo.includes(filters.mobileNo) : true;
      const appointmentWithMatch = filters.appointmentWith ? row.appointmentWith.toLowerCase().includes(filters.appointmentWith.toLowerCase()) : true;
      const nationalityMatch = filters.nationality ? row.nationality.toLowerCase().includes(filters.nationality.toLowerCase()) : true;
      const statusMatch = filters.status ? row.status.toLowerCase().includes(filters.status.toLowerCase()) : true;
      const unitNameMatch = filters.unitName ? row.unitName.toLowerCase().includes(filters.unitName.toLowerCase()) : true;
      const approverMatch = filters.approver ? row.approver.toLowerCase().includes(filters.approver.toLowerCase()) : true;
      return nameMatch && mobileMatch && appointmentWithMatch && nationalityMatch && statusMatch && unitNameMatch && approverMatch;
    });
  }
} 