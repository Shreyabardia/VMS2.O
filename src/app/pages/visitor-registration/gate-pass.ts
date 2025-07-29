import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gate-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gate-pass.html',
})
export class GatePassComponent implements OnInit {
  filterForm: FormGroup;
  dateForm: FormGroup;
  visitors: any[] = [];
  filteredVisitors: any[] = [];
  totalItems = 0;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      visitorName: [''],
      companyName: [''],
      phoneNo: [''],
      status: [''],
      gatePass: [''],
    });
    this.dateForm = this.fb.group({
      date: [''],
    });
  }

  ngOnInit(): void {
    // Mock data for demonstration
    this.visitors = [
      { visitorName: 'Alice Smith', companyName: 'Acme Corp', phoneNo: '9876543210', status: 'Approved', gatePass: 'GP001', date: '2023-11-15' },
      { visitorName: 'Bob Johnson', companyName: 'Beta Ltd', phoneNo: '9876543211', status: 'Pending', gatePass: 'GP002', date: '2023-11-16' },
      { visitorName: 'Charlie Lee', companyName: 'Gamma Inc', phoneNo: '9876543212', status: 'Rejected', gatePass: 'GP003', date: '2023-11-17' },
      { visitorName: 'David Kim', companyName: 'Delta LLC', phoneNo: '9876543213', status: 'Approved', gatePass: 'GP004', date: '2023-11-18' },
      { visitorName: 'Emily Clark', companyName: 'Epsilon GmbH', phoneNo: '9876543214', status: 'Pending', gatePass: 'GP005', date: '2023-11-19' },
    ];
    this.filteredVisitors = this.visitors;
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.dateForm.valueChanges.subscribe(() => this.applyFilters());
    this.totalItems = this.filteredVisitors.length;
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const date = this.dateForm.get('date')?.value;
    this.filteredVisitors = this.visitors.filter((visitor) => {
      const dateMatch = date ? visitor.date === date : true;
      const visitorNameMatch = filters.visitorName ? visitor.visitorName.toLowerCase().includes(filters.visitorName.toLowerCase()) : true;
      const companyNameMatch = filters.companyName ? visitor.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) : true;
      const phoneNoMatch = filters.phoneNo ? visitor.phoneNo.includes(filters.phoneNo) : true;
      const statusMatch = filters.status ? visitor.status.toLowerCase().includes(filters.status.toLowerCase()) : true;
      const gatePassMatch = filters.gatePass ? visitor.gatePass.toLowerCase().includes(filters.gatePass.toLowerCase()) : true;
      return dateMatch && visitorNameMatch && companyNameMatch && phoneNoMatch && statusMatch && gatePassMatch;
    });
    this.totalItems = this.filteredVisitors.length;
  }
} 