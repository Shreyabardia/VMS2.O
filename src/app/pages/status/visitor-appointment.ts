import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-visitor-appointment-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visitor-appointment.html',
})
export class VisitorAppointmentStatusComponent implements OnInit {
  dateRangeForm: FormGroup;
  filterForm: FormGroup;

  private allAppointments = new BehaviorSubject<any[]>([]);
  paginatedAppointments$ = new BehaviorSubject<any[]>([]);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  constructor(private fb: FormBuilder) {
    this.dateRangeForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.filterForm = this.fb.group({
      name: [''],
      mobileNo: [''],
      appointmentWith: [''],
      nationality: [''],
      status: [''],
      unitName: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 5 : 9;
  }

  ngOnInit(): void {
    this.getAppointmentsFromBackend().subscribe((apps) => {
      this.allAppointments.next(apps);
    });

    combineLatest([
      this.dateRangeForm.valueChanges.pipe(startWith(this.dateRangeForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(
        map(([dateRange, filters]) => this.applyFilters(dateRange, filters)),
      )
      .subscribe((filteredApps) => {
        this.totalItems = filteredApps.length;
        this.goToPage(1);
        this.updatePaginatedAppointments();
      });

    this.allAppointments.subscribe(() => {
      const filtered = this.applyFilters(
        this.dateRangeForm.value,
        this.filterForm.value,
      );
      this.totalItems = filtered.length;
      this.updatePaginatedAppointments();
    });
  }

  // Simulates fetching data from a backend
  getAppointmentsFromBackend() {
    return of(this.generateDummyAppointments(200));
  }

  generateDummyAppointments(count: number) {
    const statuses = ['Pending', 'Approved', 'Rejected', 'Completed'];
    const nationalities = ['Indian', 'American', 'British', 'German', 'Other'];
    const appointments = [];
    for (let i = 1; i <= count; i++) {
      appointments.push({
        srNo: i,
        name: `Visitor ${i}`,
        mobileNo: `98765${(10000 + i).toString().slice(-5)}`,
        appointmentWith: `Employee ${i % 20}`,
        nationality: nationalities[i % nationalities.length],
        status: statuses[i % statuses.length],
        unitName: `Unit ${i % 5}`,
      });
    }
    return appointments;
  }

  applyFilters(dateRange: any, filters: any): any[] {
    const { fromDate, toDate } = dateRange;
    return this.allAppointments.getValue().filter((app) => {
      // No date field in dummy data, but you can add logic if you add a date
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const appValue = app[key]?.toString().toLowerCase() || '';
        return !filterValue || appValue.includes(filterValue);
      });
    });
  }

  updatePaginatedAppointments() {
    const filtered = this.applyFilters(
      this.dateRangeForm.value,
      this.filterForm.value,
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments$.next(filtered.slice(startIndex, endIndex));
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    return getPaginationPages(this.currentPage, this.totalPages, this.maxPages);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAppointments();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  clearFilter(controlName: string) {
    this.filterForm.get(controlName)?.reset();
  }
}
