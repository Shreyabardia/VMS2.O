import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-user.html',
})
export class ModifyUserComponent implements OnInit {
  filterForm: FormGroup;
  editForm: FormGroup;

  // All users from the "backend"
  private allUsers = new BehaviorSubject<any[]>([]);

  // Pagination state
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  // Data for the current page
  paginatedUsers$ = new BehaviorSubject<any[]>([]);

  isEditing = false;
  selectedUser: any = null;

  designationOptions = ['VMS Admin', 'HOD', 'Dept.Admin', 'Custom Officer'];
  departmentOptions = ['Information Technology', 'Security', 'HR'];
  unitNameOptions = [
    'Tata Advanced Systems Ltd.',
    'Tata Sikorsky Aerospace Ltd.',
    'Tata Lockheed Martin Aerostructure Ltd.',
    'Tata Boeing Aerospace Ltd.',
  ];
  statusOptions = ['Active', 'Inactive'];
  roleOptions = ['VMS Admin', 'HOD', 'Dept.Admin', 'Custom Officer'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      userName: [''],
      userLogin: [''],
      designation: [''],
      emailId: [''],
      department: [''],
      dateOfCreation: [''],
      unitName: [''],
      status: [''],
    });

    this.editForm = this.fb.group({
      id: [''],
      userName: ['', Validators.required],
      userLogin: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      unitName: ['', Validators.required],
      role: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
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
    this.getUsersFromBackend().subscribe((users) => {
      this.allUsers.next(users);
    });

    this.filterForm.valueChanges
      .pipe(switchMap((filters) => this.applyFilters(filters)))
      .subscribe((filteredUsers) => {
        this.totalItems = filteredUsers.length;
        this.goToPage(1); // Reset to first page after filtering
        this.updatePaginatedUsers();
      });

    this.allUsers.subscribe(() => {
      this.applyFilters(this.filterForm.value).subscribe((filteredUsers) => {
        this.totalItems = filteredUsers.length;
        this.updatePaginatedUsers();
      });
    });
  }

  // Simulates fetching data from a backend
  getUsersFromBackend() {
    console.log('Fetching users...');
    // Returning an observable to mimic a real API call.
    return of(this.generateDummyUsers(2600));
  }

  generateDummyUsers(count: number) {
    const users = [];
    const baseUser = {
      userName: 'User',
      userLogin: 'user',
      designation: 'HOD',
      emailId: 'user@example.com',
      department: 'IT',
      dateOfCreation: '2023-01-01',
      unitName: 'Tata Advanced Systems Ltd.',
      status: 'Active',
      role: 'HOD',
    };

    for (let i = 1; i <= count; i++) {
      users.push({
        ...baseUser,
        id: i,
        userName: `${baseUser.userName} ${i}`,
        userLogin: `${baseUser.userLogin}${i}`,
        emailId: `user${i}@example.com`,
        // Add some variation for filtering
        department: this.departmentOptions[i % this.departmentOptions.length],
        status: this.statusOptions[i % this.statusOptions.length],
      });
    }
    return users;
  }

  applyFilters(filters: any) {
    return this.allUsers.pipe(
      map((users) => {
        return users.filter((user) => {
          return Object.keys(filters).every((key) => {
            const filterValue = filters[key]?.toString().toLowerCase() || '';
            const userValue = user[key]?.toString().toLowerCase() || '';
            if (!filterValue) return true;
            return userValue.includes(filterValue);
          });
        });
      }),
    );
  }

  updatePaginatedUsers() {
    this.applyFilters(this.filterForm.value).subscribe((filteredUsers) => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedUsers$.next(filteredUsers.slice(startIndex, endIndex));
    });
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
      this.updatePaginatedUsers();
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

  editUser(user: any) {
    this.isEditing = true;
    this.selectedUser = user;
    this.editForm.patchValue(user);
  }

  saveUser() {
    if (this.editForm.valid) {
      const updatedUser = {
        ...this.selectedUser,
        ...this.editForm.getRawValue(),
      };
      const currentUsers = this.allUsers.getValue();
      const index = currentUsers.findIndex((u) => u.id === updatedUser.id);
      if (index > -1) {
        const newUsers = [...currentUsers];
        newUsers[index] = updatedUser;
        this.allUsers.next(newUsers);
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedUser = null;
    this.editForm.reset();
  }

  exportUsers() {
    this.applyFilters(this.filterForm.value).subscribe((filteredUsers) => {
      if (!filteredUsers.length) {
        alert('No users to export.');
        return;
      }
      const header = [
        'User Name',
        'User Login',
        'Designation',
        'Email ID',
        'Department',
        'Unit Name',
        'Status',
        'Date of Creation',
      ];
      const rows = filteredUsers.map((user) => [
        user.userName,
        user.userLogin,
        user.designation,
        user.emailId,
        user.department,
        user.unitName,
        user.status,
        user.dateOfCreation,
      ]);
      const csvContent = [header, ...rows]
        .map((e) => e.map((v) => '"' + (v || '') + '"').join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
