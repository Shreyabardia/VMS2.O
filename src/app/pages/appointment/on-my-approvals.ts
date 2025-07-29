import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-on-my-approvals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './on-my-approvals.html',
})
export class OnMyApprovalsComponent implements OnInit {
  dateRangeForm: FormGroup;
  filterForm: FormGroup;

  private allApprovals = new BehaviorSubject<any[]>([]);
  paginatedApprovals$ = new BehaviorSubject<any[]>([]);

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
      nationality: [''],
      appointmentWith: [''],
      company: [''],
      status: [''],
      unitName: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 2 : 9;
  }

  ngOnInit(): void {
    this.getApprovalsFromBackend().subscribe((approvals) => {
      this.allApprovals.next(approvals);
    });

    combineLatest([
      this.dateRangeForm.valueChanges.pipe(startWith(this.dateRangeForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(
        map(([dateRange, filters]) => this.applyFilters(dateRange, filters)),
      )
      .subscribe((filteredApprovals) => {
        this.totalItems = filteredApprovals.length;
        this.goToPage(1);
        this.updatePaginatedApprovals();
      });

    this.allApprovals.subscribe(() => {
      const filtered = this.applyFilters(
        this.dateRangeForm.value,
        this.filterForm.value,
      );
      this.totalItems = filtered.length;
      this.updatePaginatedApprovals();
    });
  }

  // Simulates fetching data from a backend
  getApprovalsFromBackend() {
    return of(this.generateDummyApprovals(100));
  }

  generateDummyApprovals(count: number) {
    const nationalities = ['Indian', 'American', 'British', 'German', 'French'];
    const companies = ['Microsoft', 'Wipro', 'TCS', 'Infosys', 'Google'];
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
    const approvals = [];
    for (let i = 1; i <= count; i++) {
      approvals.push({
        name: `Visitor ${i}`,
        mobileNo: `98765432${(10 + i) % 100}`,
        nationality: nationalities[i % nationalities.length],
        appointmentWith: `Employee ${i}`,
        company: companies[i % companies.length],
        status: statuses[i % statuses.length],
        unitName: units[i % units.length],
      });
    }
    return approvals;
  }

  applyFilters(dateRange: any, filters: any): any[] {
    const { fromDate, toDate } = dateRange;
    return this.allApprovals.getValue().filter((app) => {
      // No date filtering for now, as no date field in new columns
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const appValue = app[key]?.toString().toLowerCase() || '';
        return !filterValue || appValue.includes(filterValue);
      });
    });
  }

  updatePaginatedApprovals() {
    const filtered = this.applyFilters(
      this.dateRangeForm.value,
      this.filterForm.value,
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedApprovals$.next(filtered.slice(startIndex, endIndex));
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
      this.updatePaginatedApprovals();
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