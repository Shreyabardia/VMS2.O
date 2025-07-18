import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-unit-wise-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './unit-wise-details.html',
})
export class UnitWiseDetailsComponent implements OnInit {
  addEditForm: FormGroup;
  filterForm: FormGroup;

  private allDetails = new BehaviorSubject<any[]>([]);
  paginatedDetails$ = new BehaviorSubject<any[]>([]);

  isEditing = false;
  selectedDetailId: number | null = null;

  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  unitOptions = [
    'Tata Advanced Systems Ltd.',
    'Tata Sikorsky Aerospace Ltd.',
    'Tata Lockheed Martin Aerostructure Ltd.',
    'Tata Boeing Aerospace Ltd.',
    'TATA Center of Excellence (TCOE)',
  ];
  designationOptions = ['Admin', 'Customs Officer'];
  statusFilterOptions = ['All', 'Active', 'Inactive'];

  constructor(private fb: FormBuilder) {
    this.addEditForm = this.fb.group({
      unit: ['', Validators.required],
      name: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      designation: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
    });

    this.filterForm = this.fb.group({
      unitName: [''],
      name: [''],
      designation: [''],
      emailAddresses: [''],
      mobileNumber: [''],
      status: ['All'],
    });
  }

  ngOnInit(): void {
    this.getDetailsFromBackend().subscribe((details) => {
      this.allDetails.next(details);
    });

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        map((filters) => this.applyFilters(filters)),
      )
      .subscribe((filtered) => {
        this.totalItems = filtered.length;
        this.goToPage(1);
        this.updatePaginatedDetails();
      });

    this.allDetails.subscribe(() => {
      const filtered = this.applyFilters(this.filterForm.value);
      this.totalItems = filtered.length;
      this.updatePaginatedDetails();
    });
  }

  // Simulates fetching data from a backend
  getDetailsFromBackend() {
    return of(this.generateDummyData());
  }

  generateDummyData() {
    const firstNames = [
      'Alex',
      'Jordan',
      'Taylor',
      'Morgan',
      'Casey',
      'Riley',
      'Jamie',
      'Avery',
      'Peyton',
      'Drew',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Lee',
      'Patel',
      'Brown',
      'Garcia',
      'Martinez',
      'Davis',
      'Clark',
      'Lewis',
    ];
    const unitNames = [
      'Tata Advanced Systems Ltd.',
      'Tata Sikorsky Aerospace Ltd.',
      'Tata Lockheed Martin Aerostructure Ltd.',
      'Tata Boeing Aerospace Ltd.',
      'TATA Center of Excellence (TCOE)',
    ];
    const designations = ['admin', 'customsofficer'];
    const domains = ['example.com', 'mail.com', 'test.org', 'company.in'];
    const getRandom = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const getRandomNumber = (length: number) => {
      let num = '';
      for (let i = 0; i < length; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
    };

    const data = [];
    for (let i = 1; i <= 15; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const name = `${firstName} ${lastName}`;
      const unitName = getRandom(unitNames);
      const designation = getRandom(designations);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${getRandom(domains)}`;
      const mobileNumber = getRandomNumber(10);
      const isActive = Math.random() > 0.2;
      data.push({
        id: i,
        unitName,
        name,
        designation,
        emailAddresses: email,
        mobileNumber,
        activeInactive: isActive ? 'Active' : 'Inactive',
        status: isActive,
      });
    }
    return data;
  }

  applyFilters(filters: any): any[] {
    return this.allDetails.getValue().filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]?.toString().toLowerCase() || '';
        const itemValue = item[key]?.toString().toLowerCase() || '';

        if (key === 'status') {
          if (filterValue === 'all' || filterValue === '') return true;
          return item.activeInactive.toLowerCase() === filterValue;
        }

        return !filterValue || itemValue.includes(filterValue);
      });
    });
  }

  updatePaginatedDetails() {
    const filtered = this.applyFilters(this.filterForm.value);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDetails$.next(filtered.slice(startIndex, endIndex));
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
      this.updatePaginatedDetails();
    }
  }
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  toggleStatus(detailToUpdate: any) {
    const currentDetails = this.allDetails.getValue();
    const index = currentDetails.findIndex((d) => d.id === detailToUpdate.id);
    if (index > -1) {
      const updatedDetails = [...currentDetails];
      const newStatus = !updatedDetails[index].status;
      updatedDetails[index] = {
        ...updatedDetails[index],
        status: newStatus,
        activeInactive: newStatus ? 'Active' : 'Inactive',
      };
      this.allDetails.next(updatedDetails);
    }
  }

  onSubmit() {
    if (this.addEditForm.invalid) return;

    const currentDetails = this.allDetails.getValue();
    const formData = this.addEditForm.value;

    if (this.isEditing && this.selectedDetailId !== null) {
      // Update existing
      const index = currentDetails.findIndex(
        (d) => d.id === this.selectedDetailId,
      );
      if (index > -1) {
        const updatedDetails = [...currentDetails];
        updatedDetails[index] = {
          ...updatedDetails[index],
          ...this.mapFormToData(formData),
        };
        this.allDetails.next(updatedDetails);
      }
    } else {
      // Add new
      const newId = Math.max(...currentDetails.map((d) => d.id)) + 1;
      const newDetail = {
        id: newId,
        ...this.mapFormToData(formData),
        status: true,
        activeInactive: 'Active',
      };
      this.allDetails.next([newDetail, ...currentDetails]);
    }
    this.cancelEdit();
  }

  editDetail(detail: any) {
    this.isEditing = true;
    this.selectedDetailId = detail.id;
    this.addEditForm.patchValue({
      unit: detail.unitName,
      name: detail.name,
      mobileNumber: detail.mobileNumber,
      designation: detail.designation,
      emailAddress: detail.emailAddresses,
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedDetailId = null;
    this.addEditForm.reset();
  }

  mapFormToData(formData: any) {
    return {
      unitName: formData.unit,
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      designation: formData.designation,
      emailAddresses: formData.emailAddress,
    };
  }

  clearFilter(controlName: string) {
    this.filterForm.get(controlName)?.setValue('');
  }

  exportDetails() {
    const filtered = this.applyFilters(this.filterForm.value);
    if (!filtered.length) {
      alert('No details to export.');
      return;
    }
    const header = [
      'Unit Name',
      'Name',
      'Designation',
      'Email Address',
      'Mobile Number',
      'Status',
    ];
    const rows = filtered.map((detail) => [
      detail.unitName,
      detail.name,
      detail.designation,
      detail.emailAddresses,
      detail.mobileNumber,
      detail.activeInactive,
    ]);
    const csvContent = [header, ...rows]
      .map((e) => e.map((v) => '"' + (v || '') + '"').join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'unit-admin-details.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
