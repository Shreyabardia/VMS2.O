import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-items-carried',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items-carried.html',
})
export class ItemsCarriedComponent implements OnInit {
  dateForm: FormGroup;
  filterForm: FormGroup;

  private allItems = new BehaviorSubject<any[]>([]);
  paginatedItems$ = new BehaviorSubject<any[]>([]);

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
      phoneNo: [''],
      companyName: [''],
      dateTime: [''],
      device: [''],
      maker: [''],
      srNo: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 2 : 9;
  }

  ngOnInit(): void {
    this.getItemsFromBackend().subscribe((items) => {
      this.allItems.next(items);
    });

    combineLatest([
      this.dateForm.valueChanges.pipe(startWith(this.dateForm.value)),
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(map(([date, filters]) => this.applyFilters(date, filters)))
      .subscribe((filteredItems) => {
        this.totalItems = filteredItems.length;
        this.goToPage(1);
        this.updatePaginatedItems();
      });

    this.allItems.subscribe(() => {
      const filtered = this.applyFilters(
        this.dateForm.value,
        this.filterForm.value,
      );
      this.totalItems = filtered.length;
      this.updatePaginatedItems();
    });
  }

  // Simulates fetching data from a backend
  getItemsFromBackend() {
    return of(this.generateDummyItems(200));
  }

  generateDummyItems(count: number) {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        srNo: i,
        visitorName: `Visitor ${i}`,
        phoneNo: `98765${(10000 + i).toString().slice(-5)}`,
        companyName: ['Microsoft', 'Wipro', 'TCS', 'Infosys', 'Google'][i % 5],
        dateTime: `2023-11-${(10 + (i % 20)).toString().padStart(2, '0')} 10:${(i % 60).toString().padStart(2, '0')}`,
        device: ['Laptop', 'Tablet', 'Phone', 'Camera', 'None'][i % 5],
        maker: ['Dell', 'HP', 'Apple', 'Samsung', 'Lenovo'][i % 5],
        srNoDevice: `SR${10000 + i}`,
      });
    }
    return items;
  }

  applyFilters(date: any, filters: any): any[] {
    const { date: selectedDate } = date;
    return this.allItems.getValue().filter((item) => {
      if (selectedDate && !item.dateTime.startsWith(selectedDate)) return false;
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const itemValue = item[key]?.toString().toLowerCase() || '';
        return !filterValue || itemValue.includes(filterValue);
      });
    });
  }

  updatePaginatedItems() {
    const filtered = this.applyFilters(
      this.dateForm.value,
      this.filterForm.value,
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems$.next(filtered.slice(startIndex, endIndex));
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
      this.updatePaginatedItems();
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
