import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-appointment-approval',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-approval.html',
})
export class AppointmentApprovalComponent implements OnInit {
  dateForm: FormGroup;

  // Pending Appointments
  pendingFilterForm: FormGroup;
  private allPending = new BehaviorSubject<any[]>([]);
  paginatedPending$ = new BehaviorSubject<any[]>([]);
  pendingCurrentPage = 1;
  pendingItemsPerPage = 5;
  pendingTotalItems = 0;
  pendingMaxPages = 9;

  // Pending On Gate
  onGateFilterForm: FormGroup;
  private allOnGate = new BehaviorSubject<any[]>([]);
  paginatedOnGate$ = new BehaviorSubject<any[]>([]);
  onGateCurrentPage = 1;
  onGateItemsPerPage = 5;
  onGateTotalItems = 0;
  onGateMaxPages = 9;

  constructor(private fb: FormBuilder) {
    this.dateForm = this.fb.group({
      date: [''],
    });
    this.pendingFilterForm = this.fb.group({
      name: [''],
      mobileNo: [''],
      nationality: [''],
      meeting: [''],
      date: [''],
      company: [''],
      status: [''],
      unitName: [''],
      viewDetails: [''],
    });
    this.onGateFilterForm = this.fb.group({
      visitorName: [''],
      mobileNumber: [''],
      meeting: [''],
      companyName: [''],
      status: [''],
      viewDetails: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    const isMobile = window.innerWidth < 640;
    this.pendingMaxPages = isMobile ? 5 : 9;
    this.onGateMaxPages = isMobile ? 5 : 9;
  }

  ngOnInit(): void {
    this.getPendingAppointments().subscribe((data) =>
      this.allPending.next(data),
    );
    this.getPendingOnGate().subscribe((data) => this.allOnGate.next(data));

    this.pendingFilterForm.valueChanges
      .pipe(
        startWith(this.pendingFilterForm.value),
        map((filters) => this.applyPendingFilters(filters)),
      )
      .subscribe((filtered) => {
        this.pendingTotalItems = filtered.length;
        this.goToPendingPage(1);
        this.updatePaginatedPending();
      });
    this.allPending.subscribe(() => {
      const filtered = this.applyPendingFilters(this.pendingFilterForm.value);
      this.pendingTotalItems = filtered.length;
      this.updatePaginatedPending();
    });

    this.onGateFilterForm.valueChanges
      .pipe(
        startWith(this.onGateFilterForm.value),
        map((filters) => this.applyOnGateFilters(filters)),
      )
      .subscribe((filtered) => {
        this.onGateTotalItems = filtered.length;
        this.goToOnGatePage(1);
        this.updatePaginatedOnGate();
      });
    this.allOnGate.subscribe(() => {
      const filtered = this.applyOnGateFilters(this.onGateFilterForm.value);
      this.onGateTotalItems = filtered.length;
      this.updatePaginatedOnGate();
    });
  }

  // Dummy data generators
  getPendingAppointments() {
    return of(
      Array.from({ length: 12 }, (_, i) => ({
        name: `Visitor ${i + 1}`,
        mobileNo: `90000000${i + 1}`,
        nationality: 'Indian',
        meeting: `Employee ${i + 1}`,
        date: '2024-06-01',
        company: `Company ${i + 1}`,
        status: 'Pending',
        unitName: `Unit ${(i % 3) + 1}`,
        viewDetails: '',
      })),
    );
  }
  getPendingOnGate() {
    return of(
      Array.from({ length: 7 }, (_, i) => ({
        visitorName: `GateVisitor ${i + 1}`,
        mobileNumber: `80000000${i + 1}`,
        meeting: `Employee ${i + 1}`,
        companyName: `Company ${i + 1}`,
        status: 'Pending',
        viewDetails: '',
      })),
    );
  }

  // Filtering and pagination logic
  applyPendingFilters(filters: any): any[] {
    return this.allPending.getValue().filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const itemValue = item[key]?.toString().toLowerCase() || '';
        return !filterValue || itemValue.includes(filterValue);
      });
    });
  }

  clearPendingFilter(controlName: string) {
    this.pendingFilterForm.get(controlName)?.setValue('');
  }

  clearOnGateFilter(controlName: string) {
    this.onGateFilterForm.get(controlName)?.setValue('');
  }
  updatePaginatedPending() {
    const filtered = this.applyPendingFilters(this.pendingFilterForm.value);
    const startIndex = (this.pendingCurrentPage - 1) * this.pendingItemsPerPage;
    const endIndex = startIndex + this.pendingItemsPerPage;
    this.paginatedPending$.next(filtered.slice(startIndex, endIndex));
  }
  get pendingTotalPages() {
    return Math.ceil(this.pendingTotalItems / this.pendingItemsPerPage);
  }
  get pendingPages() {
    return getPaginationPages(
      this.pendingCurrentPage,
      this.pendingTotalPages,
      this.pendingMaxPages,
    );
  }
  goToPendingPage(page: number) {
    if (page >= 1 && page <= this.pendingTotalPages) {
      this.pendingCurrentPage = page;
      this.updatePaginatedPending();
    }
  }
  nextPendingPage() {
    this.goToPendingPage(this.pendingCurrentPage + 1);
  }
  previousPendingPage() {
    this.goToPendingPage(this.pendingCurrentPage - 1);
  }

  applyOnGateFilters(filters: any): any[] {
    return this.allOnGate.getValue().filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const itemValue = item[key]?.toString().toLowerCase() || '';
        return !filterValue || itemValue.includes(filterValue);
      });
    });
  }
  updatePaginatedOnGate() {
    const filtered = this.applyOnGateFilters(this.onGateFilterForm.value);
    const startIndex = (this.onGateCurrentPage - 1) * this.onGateItemsPerPage;
    const endIndex = startIndex + this.onGateItemsPerPage;
    this.paginatedOnGate$.next(filtered.slice(startIndex, endIndex));
  }
  get onGateTotalPages() {
    return Math.ceil(this.onGateTotalItems / this.onGateItemsPerPage);
  }
  get onGatePages() {
    return getPaginationPages(
      this.onGateCurrentPage,
      this.onGateTotalPages,
      this.onGateMaxPages,
    );
  }
  goToOnGatePage(page: number) {
    if (page >= 1 && page <= this.onGateTotalPages) {
      this.onGateCurrentPage = page;
      this.updatePaginatedOnGate();
    }
  }
  nextOnGatePage() {
    this.goToOnGatePage(this.onGateCurrentPage + 1);
  }
  previousOnGatePage() {
    this.goToOnGatePage(this.onGateCurrentPage - 1);
  }

  // Export methods
  exportPendingAppointments() {
    console.log('Exporting pending appointments...');
    // Implementation for exporting pending appointments
  }

  exportOnGateRegistrations() {
    console.log('Exporting on gate registrations...');
    // Implementation for exporting on gate registrations
  }

  // Action methods
  viewPendingDetails(item: any) {
    console.log('Viewing pending details:', item);
    // Implementation for viewing pending appointment details
  }

  approvePending(item: any) {
    console.log('Approving pending appointment:', item);
    // Implementation for approving pending appointment
  }

  viewOnGateDetails(item: any) {
    console.log('Viewing on gate details:', item);
    // Implementation for viewing on gate registration details
  }

  approveOnGate(item: any) {
    console.log('Approving on gate registration:', item);
    // Implementation for approving on gate registration
  }
}
