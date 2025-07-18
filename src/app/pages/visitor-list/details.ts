import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.html',
})
export class DetailsComponent implements OnInit {
  filterForm: FormGroup;

  private allVisitors = new BehaviorSubject<any[]>([]);
  paginatedVisitors$ = new BehaviorSubject<any[]>([]);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      visitorName: [''],
      companyName: [''],
      visitorDesignation: [''],
      phoneNo: [''],
      houseNo: [''],
      areaStreet: [''],
      city: [''],
      state: [''],
      pincode: [''],
      image: [''],
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

    this.filterForm.valueChanges
      .pipe(startWith(this.filterForm.value))
      .pipe(map((filters) => this.applyFilters(filters)))
      .subscribe((filteredVisitors) => {
        this.totalItems = filteredVisitors.length;
        this.goToPage(1);
        this.updatePaginatedVisitors();
      });

    this.allVisitors.subscribe(() => {
      const filtered = this.applyFilters(this.filterForm.value);
      this.totalItems = filtered.length;
      this.updatePaginatedVisitors();
    });
  }

  // Simulates fetching data from a backend
  getVisitorsFromBackend() {
    return of(this.generateDummyVisitors(200));
  }

  generateDummyVisitors(count: number) {
    const companies = ['Microsoft', 'Wipro', 'TCS', 'Infosys', 'Google'];
    const designations = [
      'Manager',
      'Civilian',
      'Engineer',
      'Analyst',
      'Director',
    ];
    const cities = ['Hyderabad', 'Itanagar', 'Mumbai', 'Delhi', 'Bangalore'];
    const states = [
      'TELANGANA',
      'ARUNACHAL PRADESH',
      'MAHARASHTRA',
      'DELHI',
      'KARNATAKA',
    ];
    const visitors = [];
    for (let i = 1; i <= count; i++) {
      visitors.push({
        visitorName: `Visitor ${i}`,
        companyName: companies[i % companies.length],
        visitorDesignation: designations[i % designations.length],
        phoneNo: `98765${(10000 + i).toString().slice(-5)}`,
        houseNo: `${(i % 100) + 1}-${i % 10}`,
        areaStreet: `Area ${i % 20}`,
        city: cities[i % cities.length],
        state: states[i % states.length],
        pincode: `50${(100 + i).toString().slice(-3)}`,
        image:
          'https://i.scdn.co/image/ab67616d00001e02e27ec71c111b88de91a51600',
      });
    }
    return visitors;
  }

  applyFilters(filters: any): any[] {
    return this.allVisitors.getValue().filter((visitor) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const visitorValue = visitor[key]?.toString().toLowerCase() || '';
        return !filterValue || visitorValue.includes(filterValue);
      });
    });
  }

  updatePaginatedVisitors() {
    const filtered = this.applyFilters(this.filterForm.value);
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
