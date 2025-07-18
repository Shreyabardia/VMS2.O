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
import { switchMap, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-department-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './department-master.html',
})
export class DepartmentMasterComponent implements OnInit {
  addDepartmentForm: FormGroup;
  filterForm: FormGroup;
  editForm: FormGroup;

  // All departments from the "backend"
  private allDepartments = new BehaviorSubject<any[]>([]);

  // Pagination state
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  // Data for the current page
  paginatedDepartments$ = new BehaviorSubject<any[]>([]);

  isEditing = false;
  selectedDepartment: any = null;

  organizationTypes = [
    'Tata Advanced Systems Ltd.',
    'Tata Sikorsky Aerospace Ltd.',
    'Tata Lockheed Martin Aerostructure Ltd.',
    'Tata Boeing Aerospace Ltd.',
    'Tata Technologies Ltd.',
    'Tata Consultancy Services',
  ];

  constructor(private fb: FormBuilder) {
    this.addDepartmentForm = this.fb.group({
      organizationType: ['', Validators.required],
      departmentName: ['', Validators.required],
      description: [''],
    });

    this.filterForm = this.fb.group({
      organizationType: [''],
      departmentName: [''],
      description: [''],
    });

    this.editForm = this.fb.group({
      id: [''],
      organizationType: ['', Validators.required],
      departmentName: ['', Validators.required],
      description: [''],
    });
    this.setResponsiveMaxPages();
    window.addEventListener('resize', this.setResponsiveMaxPages.bind(this));
  }

  setResponsiveMaxPages() {
    this.maxPages = window.innerWidth < 640 ? 5 : 9;
  }

  ngOnInit(): void {
    // In a real app, this would be an HTTP call to a backend service.
    // We use a mock service that returns an observable.
    this.getDepartmentsFromBackend().subscribe((departments) => {
      this.allDepartments.next(departments);
    });

    this.filterForm.valueChanges
      .pipe(switchMap((filters) => this.applyFilters(filters)))
      .subscribe((filteredDepartments) => {
        this.totalItems = filteredDepartments.length;
        this.goToPage(1); // Reset to first page after filtering
        this.updatePaginatedDepartments();
      });

    this.allDepartments.subscribe(() => {
      this.applyFilters(this.filterForm.value).subscribe(
        (filteredDepartments) => {
          this.totalItems = filteredDepartments.length;
          this.updatePaginatedDepartments();
        },
      );
    });
  }

  // Simulates fetching data from a backend
  getDepartmentsFromBackend() {
    console.log('Fetching departments...');
    // Returning an observable to mimic a real API call.
    return of(this.generateDummyDepartments(25));
  }

  generateDummyDepartments(count: number) {
    const departments = [];
    const departmentNames = [
      'Information Technology',
      'Human Resources',
      'Finance',
      'Operations',
      'Marketing',
      'Sales',
      'Research & Development',
      'Quality Assurance',
      'Security',
      'Legal',
      'Customer Support',
      'Product Management',
      'Engineering',
      'Design',
      'Data Analytics',
    ];

    for (let i = 1; i <= count; i++) {
      departments.push({
        id: i,
        organizationType:
          this.organizationTypes[i % this.organizationTypes.length],
        departmentName: departmentNames[i % departmentNames.length],
        description: `This is the ${departmentNames[i % departmentNames.length]} department responsible for various organizational functions.`,
        createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      });
    }
    return departments;
  }

  applyFilters(filters: any) {
    return this.allDepartments.pipe(
      map((departments) => {
        return departments.filter((department) => {
          return Object.keys(filters).every((key) => {
            const filterValue = filters[key]?.toString().toLowerCase() || '';
            const departmentValue =
              department[key]?.toString().toLowerCase() || '';
            if (!filterValue) return true;
            return departmentValue.includes(filterValue);
          });
        });
      }),
    );
  }

  updatePaginatedDepartments() {
    this.applyFilters(this.filterForm.value).subscribe(
      (filteredDepartments) => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedDepartments$.next(
          filteredDepartments.slice(startIndex, endIndex),
        );
      },
    );
  }

  // --- Pagination Controls ---
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    return getPaginationPages(this.currentPage, this.totalPages, this.maxPages);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDepartments();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  clearFilter(controlName: string) {
    this.filterForm.get(controlName)?.setValue('');
  }

  addDepartment() {
    if (this.addDepartmentForm.valid) {
      const newDepartment = {
        id: Date.now(), // Simple ID generation for demo
        ...this.addDepartmentForm.value,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const currentDepartments = this.allDepartments.getValue();
      this.allDepartments.next([newDepartment, ...currentDepartments]);

      // Reset form
      this.addDepartmentForm.reset();
    }
  }

  editDepartment(department: any) {
    this.isEditing = true;
    this.selectedDepartment = department;
    this.editForm.patchValue({
      id: department.id,
      organizationType: department.organizationType,
      departmentName: department.departmentName,
      description: department.description,
    });
  }

  saveDepartment() {
    if (this.editForm.valid) {
      const updatedDepartment = {
        ...this.selectedDepartment,
        ...this.editForm.getRawValue(),
      };
      const currentDepartments = this.allDepartments.getValue();
      const index = currentDepartments.findIndex(
        (d) => d.id === updatedDepartment.id,
      );
      if (index > -1) {
        const newDepartments = [...currentDepartments];
        newDepartments[index] = updatedDepartment;
        this.allDepartments.next(newDepartments);
      }
      this.cancelEdit();
    }
  }

  deleteDepartment(department: any) {
    if (
      confirm(
        `Are you sure you want to delete the department "${department.departmentName}"?`,
      )
    ) {
      const currentDepartments = this.allDepartments.getValue();
      const filteredDepartments = currentDepartments.filter(
        (d) => d.id !== department.id,
      );
      this.allDepartments.next(filteredDepartments);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedDepartment = null;
    this.editForm.reset();
  }

  exportDepartments() {
    this.applyFilters(this.filterForm.value).subscribe(
      (filteredDepartments) => {
        if (!filteredDepartments.length) {
          alert('No departments to export.');
          return;
        }
        const header = [
          'Organization Type',
          'Department Name',
          'Description',
          'Created Date',
        ];
        const rows = filteredDepartments.map((dep) => [
          dep.organizationType,
          dep.departmentName,
          dep.description,
          dep.createdAt,
        ]);
        const csvContent = [header, ...rows]
          .map((e) => e.map((v) => '"' + (v || '') + '"').join(','))
          .join('\n');
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'departments.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    );
  }
}
