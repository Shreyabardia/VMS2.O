import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-role.html',
})
export class AddRoleComponent implements OnInit {
  addRoleForm!: FormGroup;
  isSubmitting = false;
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addRoleForm = this.fb.group({
      roleName: ['', Validators.required],
      description: [''],
      status: ['active', Validators.required],
      privileges: this.fb.array([], Validators.required),
    });
  }

  get selectedPrivileges() {
    const privilegesArray = this.addRoleForm.get('privileges') as FormArray;
    return privilegesArray.value
      .map((privilegeId: string) =>
        this.privileges.find((p) => p.id === privilegeId),
      )
      .filter(Boolean);
  }

  onCheckboxChange(e: Event) {
    const privilegesArray: FormArray = this.addRoleForm.get(
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

  removePrivilege(privilegeId: string) {
    const privilegesArray = this.addRoleForm.get('privileges') as FormArray;
    let i: number = 0;
    privilegesArray.controls.forEach((item: any) => {
      if (item.value === privilegeId) {
        privilegesArray.removeAt(i);
        return;
      }
      i++;
    });
  }

  onSubmit() {
    if (this.addRoleForm.valid) {
      this.isSubmitting = true;
      console.log('Form submitted:', this.addRoleForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.resetForm();
        alert('Role created successfully!');
      }, 2000);
    }
  }

  resetForm() {
    this.addRoleForm.reset({
      roleName: '',
      description: '',
      status: 'active',
      privileges: [],
    });
    const privilegesArray = this.addRoleForm.get('privileges') as FormArray;
    privilegesArray.clear();
  }
}
