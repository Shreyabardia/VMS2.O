import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-ids',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ids.html',
})
export class IdsComponent implements OnInit {
  dateForm: FormGroup;
  filterForm: FormGroup;

  private allVisitors = new BehaviorSubject<any[]>([]);
  paginatedVisitors$ = new BehaviorSubject<any[]>([]);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  constructor(private fb: FormBuilder) {
    this.dateForm = this.fb.group({
      date: [''],
    });
    this.filterForm = this.fb.group({
      visitorName: [''],
      companyName: [''],
      date: [''],
      phoneNo: [''],
      idCard: [''],
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
      this.dateForm.valueChanges.pipe(startWith(this.dateForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(map(([date, filters]) => this.applyFilters(date, filters)))
      .subscribe((filteredVisitors) => {
        this.totalItems = filteredVisitors.length;
        this.goToPage(1);
        this.updatePaginatedVisitors();
      });

    this.allVisitors.subscribe(() => {
      const filtered = this.applyFilters(
        this.dateForm.value,
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
    const visitors = [];
    for (let i = 1; i <= count; i++) {
      visitors.push({
        srNo: i,
        visitorName: `Visitor ${i}`,
        companyName: ['Microsoft', 'Wipro', 'TCS', 'Infosys', 'Google'][i % 5],
        date: `2023-11-${(10 + (i % 20)).toString().padStart(2, '0')}`,
        phoneNo: `88860${(90000 + i).toString().slice(-5)}`,
        idCard: `ID${1000 + i}`,
      });
    }
    return visitors;
  }

  applyFilters(date: any, filters: any): any[] {
    const { date: selectedDate } = date;
    return this.allVisitors.getValue().filter((visitor) => {
      if (selectedDate && visitor.date !== selectedDate) return false;
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const visitorValue = visitor[key]?.toString().toLowerCase() || '';
        return !filterValue || visitorValue.includes(filterValue);
      });
    });
  }

  updatePaginatedVisitors() {
    const filtered = this.applyFilters(
      this.dateForm.value,
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
