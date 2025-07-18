import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-view-blacklist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './view.html',
})
export class ViewBlacklistComponent implements OnInit {
  filterForm: FormGroup;
  statusOptions = ['All', 'Active', 'Inactive'];

  private allBlacklisted = new BehaviorSubject<any[]>([]);
  paginatedBlacklist$ = new BehaviorSubject<any[]>([]);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      companyName: [''],
      phoneNo: [''],
      orderBy: [''],
      reason: [''],
      image: [''],
      status: ['All'],
    });
  }

  ngOnInit(): void {
    this.getBlacklistedFromBackend().subscribe((data) => {
      this.allBlacklisted.next(data);
    });

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        map((filters) => this.applyFilters(filters)),
      )
      .subscribe((filtered) => {
        this.totalItems = filtered.length;
        this.goToPage(1);
        this.updatePaginatedBlacklist();
      });

    this.allBlacklisted.subscribe(() => {
      const filtered = this.applyFilters(this.filterForm.value);
      this.totalItems = filtered.length;
      this.updatePaginatedBlacklist();
    });
  }

  // Simulates fetching data from a backend
  getBlacklistedFromBackend() {
    return of(this.generateDummyBlacklist(75));
  }

  generateDummyBlacklist(count: number) {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        name: `Blacklisted Person ${i}`,
        companyName: `Bad Company ${i % 10}`,
        phoneNo: `555-010-${i}`,
        orderBy: `Admin ${i % 5}`,
        reason: `Reason #${i}`,
        image:
          'https://i.scdn.co/image/ab67616d00001e02e27ec71c111b88de91a51600', // Placeholder image
        status: i % 2 === 0 ? 'Active' : 'Inactive',
      });
    }
    return items;
  }

  applyFilters(filters: any): any[] {
    return this.allBlacklisted.getValue().filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const itemValue = item[key]?.toString().toLowerCase() || '';
        if (key === 'status' && filterValue === 'all') return true;
        return !filterValue || itemValue.includes(filterValue);
      });
    });
  }

  updatePaginatedBlacklist() {
    const filtered = this.applyFilters(this.filterForm.value);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBlacklist$.next(filtered.slice(startIndex, endIndex));
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    return getPaginationPages(this.currentPage, this.totalPages);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedBlacklist();
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

  removeFromBlacklist(item: any) {
    // Remove the item from the blacklist
    const currentBlacklist = this.allBlacklisted.getValue();
    const updatedBlacklist = currentBlacklist.filter(
      (blacklistedItem) =>
        blacklistedItem.name !== item.name ||
        blacklistedItem.phoneNo !== item.phoneNo,
    );

    // Update the blacklist
    this.allBlacklisted.next(updatedBlacklist);

    // Update pagination if needed
    const filtered = this.applyFilters(this.filterForm.value);
    this.totalItems = filtered.length;

    // If current page is empty after removal, go to previous page
    if (
      this.currentPage > 1 &&
      this.totalItems <= (this.currentPage - 1) * this.itemsPerPage
    ) {
      this.goToPage(this.currentPage - 1);
    } else {
      this.updatePaginatedBlacklist();
    }

    console.log(`Removed ${item.name} from blacklist`);
  }
}
