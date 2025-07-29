import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-monthly-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './monthly-list.html',
})
export class MonthlyListComponent implements OnInit {
  dateRangeForm: FormGroup;
  filterForm: FormGroup;
  monthlyVisitors: any[] = [];
  filteredVisitors: any[] = [];
  totalItems = 0;

  constructor(private fb: FormBuilder) {
    this.dateRangeForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.filterForm = this.fb.group({
      srNo: [''],
      visitorName: [''],
      companyName: [''],
      inDateTime: [''],
      whomToMeet: [''],
      phoneNo: [''],
      checkOutTime: [''],
      purposeOfVisit: [''],
      nationality: [''],
    });
  }

  ngOnInit(): void {
    // Mock data for demonstration
    this.monthlyVisitors = [
      {
        visitorName: 'Bob 1',
        companyName: '456 Oak Ave',
        inDateTime: '2023-11-15 09:01',
        whomToMeet: 'Reception',
        phoneNo: '9876510001',
        checkOutTime: '2023-11-15 17:01',
        purposeOfVisit: 'Delivery',
        nationality: 'Indian',
        visitorImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        visitorName: 'Charlie 2',
        companyName: '789 Pine Rd',
        inDateTime: '2023-11-15 09:02',
        whomToMeet: 'Security',
        phoneNo: '9876510002',
        checkOutTime: '2023-11-15 17:02',
        purposeOfVisit: 'Interview',
        nationality: 'American',
        visitorImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        visitorName: 'David 3',
        companyName: '101 Maple Dr',
        inDateTime: '2023-11-15 09:03',
        whomToMeet: 'HR',
        phoneNo: '9876510003',
        checkOutTime: '2023-11-15 17:03',
        purposeOfVisit: 'Maintenance',
        nationality: 'Chinese',
        visitorImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      {
        visitorName: 'Emily 4',
        companyName: '222 Birch St',
        inDateTime: '2023-11-16 08:45',
        whomToMeet: 'Admin',
        phoneNo: '9876510004',
        checkOutTime: '2023-11-16 16:30',
        purposeOfVisit: 'Consultation',
        nationality: 'British',
        visitorImage: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      {
        visitorName: 'Fatima 5',
        companyName: '333 Cedar Ave',
        inDateTime: '2023-11-16 10:10',
        whomToMeet: 'Manager',
        phoneNo: '9876510005',
        checkOutTime: '2023-11-16 18:00',
        purposeOfVisit: 'Audit',
        nationality: 'Pakistani',
        visitorImage: 'https://randomuser.me/api/portraits/women/5.jpg',
      },
      {
        visitorName: 'George 6',
        companyName: '444 Spruce Blvd',
        inDateTime: '2023-11-17 09:30',
        whomToMeet: 'IT',
        phoneNo: '9876510006',
        checkOutTime: '2023-11-17 17:15',
        purposeOfVisit: 'Support',
        nationality: 'German',
        visitorImage: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      {
        visitorName: 'Hiroshi 7',
        companyName: '555 Willow Way',
        inDateTime: '2023-11-17 11:00',
        whomToMeet: 'CEO',
        phoneNo: '9876510007',
        checkOutTime: '2023-11-17 15:45',
        purposeOfVisit: 'Business',
        nationality: 'Japanese',
        visitorImage: 'https://randomuser.me/api/portraits/men/7.jpg',
      },
      {
        visitorName: 'Isabella 8',
        companyName: '666 Aspen Ct',
        inDateTime: '2023-11-18 09:20',
        whomToMeet: 'Finance',
        phoneNo: '9876510008',
        checkOutTime: '2023-11-18 17:10',
        purposeOfVisit: 'Review',
        nationality: 'Italian',
        visitorImage: 'https://randomuser.me/api/portraits/women/8.jpg',
      },
    ];
    this.filteredVisitors = this.monthlyVisitors;
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.dateRangeForm.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const filters = this.filterForm.value;
    const fromDate = this.dateRangeForm.get('fromDate')?.value;
    const toDate = this.dateRangeForm.get('toDate')?.value;
    this.filteredVisitors = this.monthlyVisitors.filter((visitor, idx) => {
      // Date filtering
      let dateMatch = true;
      if (fromDate) {
        dateMatch = dateMatch && (visitor.inDateTime.slice(0, 10) >= fromDate);
      }
      if (toDate) {
        dateMatch = dateMatch && (visitor.inDateTime.slice(0, 10) <= toDate);
      }
      // Other filters
      const srNoMatch = filters.srNo ? (idx + 1).toString().includes(filters.srNo) : true;
      const visitorNameMatch = filters.visitorName ? visitor.visitorName.toLowerCase().includes(filters.visitorName.toLowerCase()) : true;
      const whomToMeetMatch = filters.whomToMeet ? visitor.whomToMeet.toLowerCase().includes(filters.whomToMeet.toLowerCase()) : true;
      const companyNameMatch = filters.companyName ? visitor.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) : true;
      const inDateTimeMatch = filters.inDateTime ? visitor.inDateTime.toLowerCase().includes(filters.inDateTime.toLowerCase()) : true;
      const phoneNoMatch = filters.phoneNo ? visitor.phoneNo.toLowerCase().includes(filters.phoneNo.toLowerCase()) : true;
      const checkOutTimeMatch = filters.checkOutTime ? visitor.checkOutTime.toLowerCase().includes(filters.checkOutTime.toLowerCase()) : true;
      const purposeOfVisitMatch = filters.purposeOfVisit ? visitor.purposeOfVisit.toLowerCase().includes(filters.purposeOfVisit.toLowerCase()) : true;
      const nationalityMatch = filters.nationality ? visitor.nationality.toLowerCase().includes(filters.nationality.toLowerCase()) : true;
      return dateMatch && srNoMatch && visitorNameMatch && whomToMeetMatch && companyNameMatch && inDateTimeMatch && phoneNoMatch && checkOutTimeMatch && purposeOfVisitMatch && nationalityMatch;
    });
    this.totalItems = this.filteredVisitors.length;
  }
} 