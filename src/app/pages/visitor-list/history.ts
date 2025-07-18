import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './history.html',
})
export class HistoryComponent implements OnInit {
  dateRangeForm: FormGroup;
  filterForm: FormGroup;

  private allVisitors = new BehaviorSubject<any[]>([]);
  paginatedVisitors$ = new BehaviorSubject<any[]>([]);

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
      visitorName: [''],
      visitorAddress: [''],
      meeting: [''],
      phoneNo: [''],
      idType: [''],
      idNo: [''],
      purpose: [''],
      checkInTime: [''],
      checkOutTime: [''],
      visitorImage: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 2 : 9;
  }

  ngOnInit(): void {
    this.getVisitorsFromBackend().subscribe((visitors) => {
      this.allVisitors.next(visitors);
    });

    combineLatest([
      this.dateRangeForm.valueChanges.pipe(startWith(this.dateRangeForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(
        map(([dateRange, filters]) => this.applyFilters(dateRange, filters)),
      )
      .subscribe((filteredVisitors) => {
        this.totalItems = filteredVisitors.length;
        this.goToPage(1);
        this.updatePaginatedVisitors();
      });

    this.allVisitors.subscribe(() => {
      const filtered = this.applyFilters(
        this.dateRangeForm.value,
        this.filterForm.value,
      );
      this.totalItems = filtered.length;
      this.updatePaginatedVisitors();
    });
  }

  // Simulates fetching data from a backend
  getVisitorsFromBackend() {
    return of(this.generateDummyVisitors(200));
  }

  generateDummyVisitors(count: number) {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva'];
    const addresses = [
      '123 Main St',
      '456 Oak Ave',
      '789 Pine Rd',
      '101 Maple Dr',
      '202 Birch Ln',
    ];
    const meeting = ['Manager', 'Reception', 'Security', 'HR', 'Director'];
    const idTypes = [
      'Aadhaar',
      'PAN',
      'Passport',
      'Voter ID',
      'Driving License',
    ];
    const purposes = [
      'Meeting',
      'Delivery',
      'Interview',
      'Maintenance',
      'Visit',
    ];
    const visitors = [];
    for (let i = 1; i <= count; i++) {
      visitors.push({
        visitorName: names[i % names.length] + ' ' + i,
        visitorAddress: addresses[i % addresses.length],
        meeting: meeting[i % meeting.length],
        phoneNo: `98765${(10000 + i).toString().slice(-5)}`,
        idType: idTypes[i % idTypes.length],
        idNo: `ID${1000 + i}`,
        purpose: purposes[i % purposes.length],
        checkInTime: `2023-11-15 09:${(i % 60).toString().padStart(2, '0')}`,
        checkOutTime: `2023-11-15 17:${(i % 60).toString().padStart(2, '0')}`,
        visitorImage:
          'https://i.scdn.co/image/ab67616d00001e02e27ec71c111b88de91a51600',
      });
    }
    return visitors;
  }

  applyFilters(dateRange: any, filters: any): any[] {
    const { fromDate, toDate } = dateRange;
    return this.allVisitors.getValue().filter((visitor) => {
      const checkIn = visitor.checkInTime
        ? new Date(visitor.checkInTime.split(' ')[0])
        : null;
      if (fromDate && checkIn && new Date(fromDate) > checkIn) return false;
      if (toDate && checkIn && new Date(toDate) < checkIn) return false;
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const visitorValue = visitor[key]?.toString().toLowerCase() || '';
        return !filterValue || visitorValue.includes(filterValue);
      });
    });
  }

  updatePaginatedVisitors() {
    const filtered = this.applyFilters(
      this.dateRangeForm.value,
      this.filterForm.value,
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVisitors$.next(filtered.slice(startIndex, endIndex));
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
      this.updatePaginatedVisitors();
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
