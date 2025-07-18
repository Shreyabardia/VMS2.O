import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { getPaginationPages } from '../../helpers/pagination.helper';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-role.html',
})
export class EditRoleComponent implements OnInit {
  filterForm: FormGroup;
  editForm: FormGroup;

  // All roles from the "backend"
  private allRoles = new BehaviorSubject<any[]>([]);

  // Pagination state
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxPages = 9;

  // Data for the current page
  paginatedRoles$ = new BehaviorSubject<any[]>([]);

  isEditing = false;
  selectedRole: any = null;

  privileges = [
    { id: 'addVisitor', name: 'AddVisitor' },
    { id: 'scanbarcode', name: 'Scanbarcode' },
    { id: 'checkOut', name: 'CheckOut' },
    { id: 'viewAppointment', name: 'ViewAppointment' },
    { id: 'cancelAppointment', name: 'CancelAppointment' },
    { id: 'viewVisitors', name: 'ViewVisitors' },
    { id: 'visitosHistory', name: 'VisitosHistory' },
    { id: 'viewDateVisitors', name: 'ViewDateVisitors' },
    { id: 'viewAllVisitors', name: 'ViewAllVisitors' },
    { id: 'visitorCardList', name: 'VisitorCardList' },
    { id: 'viewItems', name: 'ViewItems' },
    { id: 'viewCheckedInVisitors', name: 'ViewCheckedInVisitors' },
    { id: 'createAppointment', name: 'CreateAppointment' },
    { id: 'blacklistVisitor', name: 'BlacklistVisitor' },
    { id: 'viewBlackList', name: 'ViewBlackList' },
    { id: 'addUser', name: 'AddUser' },
    { id: 'modifyUser', name: 'ModifyUser' },
    { id: 'changePassword', name: 'ChangePassword' },
    { id: 'cityMaster', name: 'CityMaster' },
    { id: 'createrole', name: 'createrole' },
    { id: 'viewCheckedOutVisitors', name: 'ViewCheckedOutVisitors' },
    { id: 'administratorEditUserRole', name: 'Administrator - Edit User Role' },
    { id: 'viewVisitorsUnitDateWise', name: 'ViewVisitorsUnit_DateWise' },
    { id: 'changePassword1', name: 'ChangePassword1' },
    { id: 'unitWiseAdminDetails', name: 'UnitWiseAdminDetails' },
    { id: 'greenChannelVisitor', name: 'GreenChannelVisitor' },
    { id: 'appointmentStatusApproval', name: 'AppointmentStatusApproval' },
    { id: 'ongateRegistrationApproval', name: 'OngateRegistrationApproval' },
  ];

  statusOptions = ['Active', 'Inactive'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      roleName: [''],
      description: [''],
      status: [''],
      privileges: [''],
    });

    this.editForm = this.fb.group({
      id: [''],
      roleName: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      privileges: this.fb.array([], Validators.required),
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
    this.getRolesFromBackend().subscribe((roles) => {
      this.allRoles.next(roles);
    });

    this.filterForm.valueChanges
      .pipe(switchMap((filters) => this.applyFilters(filters)))
      .subscribe((filteredRoles) => {
        this.totalItems = filteredRoles.length;
        this.goToPage(1); // Reset to first page after filtering
        this.updatePaginatedRoles();
      });

    this.allRoles.subscribe(() => {
      this.applyFilters(this.filterForm.value).subscribe((filteredRoles) => {
        this.totalItems = filteredRoles.length;
        this.updatePaginatedRoles();
      });
    });
  }

  // Simulates fetching data from a backend
  getRolesFromBackend() {
    console.log('Fetching roles...');
    // Returning an observable to mimic a real API call.
    return of(this.generateDummyRoles(50));
  }

  generateDummyRoles(count: number) {
    const roles = [];
    const privilegeGroups = [
      ['addVisitor', 'viewVisitors', 'createAppointment'],
      ['scanbarcode', 'checkOut', 'viewAppointment'],
      ['modifyUser', 'addUser', 'changePassword'],
      ['blacklistVisitor', 'viewBlackList', 'viewCheckedInVisitors'],
      [
        'administratorEditUserRole',
        'unitWiseAdminDetails',
        'appointmentStatusApproval',
      ],
    ];

    for (let i = 1; i <= count; i++) {
      const privilegeGroup = privilegeGroups[i % privilegeGroups.length];
      roles.push({
        id: i,
        roleName: `Role ${i}`,
        description: `This is a description for role ${i}. It contains various privileges and permissions.`,
        status: i % 3 === 0 ? 'Inactive' : 'Active',
        privileges: privilegeGroup,
        createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      });
    }
    return roles;
  }

  applyFilters(filters: any) {
    return this.allRoles.pipe(
      map((roles) => {
        return roles.filter((role) => {
          return Object.keys(filters).every((key) => {
            const filterValue = filters[key]?.toString().toLowerCase() || '';
            if (key === 'privileges') {
              const roleValue = role.privileges?.join(', ').toLowerCase() || '';
              return !filterValue || roleValue.includes(filterValue);
            }
            const roleValue = role[key]?.toString().toLowerCase() || '';
            if (!filterValue) return true;
            return roleValue.includes(filterValue);
          });
        });
      }),
    );
  }

  updatePaginatedRoles() {
    this.applyFilters(this.filterForm.value).subscribe((filteredRoles) => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedRoles$.next(filteredRoles.slice(startIndex, endIndex));
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
      this.updatePaginatedRoles();
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

  editRole(role: any) {
    this.isEditing = true;
    this.selectedRole = role;

    // Clear existing privileges array
    const privilegesArray = this.editForm.get('privileges') as FormArray;
    while (privilegesArray.length !== 0) {
      privilegesArray.removeAt(0);
    }

    // Add selected privileges
    role.privileges.forEach((privilege: string) => {
      privilegesArray.push(new FormControl(privilege));
    });

    this.editForm.patchValue({
      id: role.id,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
    });
  }

  onCheckboxChange(e: Event) {
    const privilegesArray: FormArray = this.editForm.get(
      'privileges',
    ) as FormArray;
    const target = e.target as HTMLInputElement;

    if (target.checked) {
      privilegesArray.push(new FormControl(target.value));
    } else {
      let i: number = 0;
      privilegesArray.controls.forEach((item: any) => {
        if (item.value == target.value) {
          privilegesArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  saveRole() {
    if (this.editForm.valid) {
      const updatedRole = {
        ...this.selectedRole,
        ...this.editForm.getRawValue(),
        privileges: this.editForm.get('privileges')?.value || [],
      };
      const currentRoles = this.allRoles.getValue();
      const index = currentRoles.findIndex((r) => r.id === updatedRole.id);
      if (index > -1) {
        const newRoles = [...currentRoles];
        newRoles[index] = updatedRole;
        this.allRoles.next(newRoles);
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedRole = null;
    this.editForm.reset();

    // Clear privileges array
    const privilegesArray = this.editForm.get('privileges') as FormArray;
    while (privilegesArray.length !== 0) {
      privilegesArray.removeAt(0);
    }
  }

  getPrivilegeNames(privilegeIds: string[]): string {
    if (!privilegeIds || privilegeIds.length === 0) {
      return 'No privileges assigned';
    }
    return privilegeIds
      .map((id) => {
        const privilege = this.privileges.find((p) => p.id === id);
        return privilege ? privilege.name : id;
      })
      .join(', ');
  }

  // Export method
  exportRoles() {
    console.log('Exporting roles...');
    // Implementation for exporting roles
  }
}
