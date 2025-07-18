import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-view-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './view.html',
})
export class ViewAppointmentComponent implements OnInit {
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
      appointmentId: [''],
      visitorName: [''],
      date: [''],
      time: [''],
      meeting: [''],
      userName: [''],
      mobileNo: [''],
      unitName: [''],
    });
    // Responsive maxPages
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 2 : 9;
  }

  ngOnInit(): void {
    this.getAppointmentsFromBackend().subscribe((appointments) => {
      this.allAppointments.next(appointments);
    });

    combineLatest([
      this.dateRangeForm.valueChanges.pipe(startWith(this.dateRangeForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(
        map(([dateRange, filters]) => this.applyFilters(dateRange, filters)),
      )
      .subscribe((filteredAppointments) => {
        this.totalItems = filteredAppointments.length;
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
    const appointments = [];
    for (let i = 1; i <= count; i++) {
      appointments.push({
        appointmentId: `ID${1000 + i}`,
        visitorName: `Visitor ${i}`,
        date: new Date(2023, 10, 15).toISOString().split('T')[0],
        time: '10:30',
        meeting: `Employee ${i}`,
        userName: `user${i}`,
        mobileNo: `123456789${i % 10}`,
        unitName: `Unit ${i % 5}`,
      });
    }
    return appointments;
  }

  applyFilters(dateRange: any, filters: any): any[] {
    const { fromDate, toDate } = dateRange;
    return this.allAppointments.getValue().filter((app) => {
      const appointmentDate = new Date(app.date);
      if (fromDate && new Date(fromDate) > appointmentDate) return false;
      if (toDate && new Date(toDate) < appointmentDate) return false;

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
