import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-on-gate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './on-gate.html',
})
export class OnGateComponent implements OnInit {
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
      companyName: [''],
      phoneNo: [''],
      status: [''],
      gatePass: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 5 : 9;
  }

  ngOnInit(): void {
    this.getApprovalsFromBackend().subscribe((approvals) => {
      this.allApprovals.next(approvals);
    });

    combineLatest([
      this.dateRangeForm.valueChanges.pipe(startWith(this.dateRangeForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(map(([search, filters]) => this.applyFilters(search, filters)))
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

  getApprovalsFromBackend() {
    return of(this.generateDummyApprovals(200));
  }

  generateDummyApprovals(count: number) {
    const approvals = [];
    for (let i = 1; i <= count; i++) {
      approvals.push({
        name: `Person ${i}`,
        companyName: `Company ${i % 10}`,
        phoneNo: `12345678${i}`,
        status: i % 2 === 0 ? 'Approved' : 'Pending',
        gatePass: `GP${1000 + i}`,
      });
    }
    return approvals;
  }

  applyFilters(search: any, filters: any): any[] {
    const { date } = search;
    return this.allApprovals.getValue().filter((app) => {
      if (date) {
        // Simple date match for demonstration
        // In a real app, you'd parse and compare dates properly.
      }
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
