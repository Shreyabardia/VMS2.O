import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/index';
import { RegistrationComponent } from './pages/visitor-registration/registration';
// import { GatePassComponent } from './pages/visitor-registration/gate-pass';
import { BacksideComponent } from './pages/visitor-registration/backside';
import { AppointmentScheduleComponent } from './pages/appointment/schedule';
import { ViewAppointmentComponent } from './pages/appointment/view';
import { ApprovalsComponent } from './pages/appointment/approvals';
import { CheckedInComponent } from './pages/visitor-list/checked-in';
import { CheckedOutComponent } from './pages/visitor-list/checked-out';
import { DetailsComponent } from './pages/visitor-list/details';
import { HistoryComponent } from './pages/visitor-list/history';
import { IdsComponent } from './pages/visitor-list/ids';
import { ItemsCarriedComponent } from './pages/visitor-list/items-carried';
import { VisitorAppointmentStatusComponent } from './pages/status/visitor-appointment';
import { OnGateComponent } from './pages/status/on-gate';
import { AddBlacklistComponent } from './pages/blacklist/add';
import { ViewBlacklistComponent } from './pages/blacklist/view';
import { AddUserComponent } from './pages/admin/add-user';
import { ModifyUserComponent } from './pages/admin/edit-user';
import { ChangePasswordComponent } from './pages/admin/change-password';
import { AddRoleComponent } from './pages/admin/add-role';
import { EditRoleComponent } from './pages/admin/edit-role';
import { UnitWiseDetailsComponent } from './pages/admin/unit-wise-details';
import { AddEmployeeComponent } from './pages/admin/add-employee';
import { AppointmentApprovalComponent } from './pages/admin/appointment-approval';
import { DepartmentMasterComponent } from './pages/admin/department-master';
import { GreenChannelComponent } from './pages/green-channel/index';
import { CheckOutComponent as PagesCheckOutComponent } from './pages/check-out/check-out';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'visitor-registration/register', component: RegistrationComponent },
  // { path: 'visitor-registration/gate-pass', component: GatePassComponent },
  { path: 'visitor-registration/backside', component: BacksideComponent },
  { path: 'appointment/schedule', component: AppointmentScheduleComponent },
  { path: 'appointment/view', component: ViewAppointmentComponent },
  { path: 'appointment/approvals', component: ApprovalsComponent },
  { path: 'visitor-list/checked-in', component: CheckedInComponent },
  { path: 'visitor-list/checked-out', component: CheckedOutComponent },
  { path: 'visitor-list/details', component: DetailsComponent },
  { path: 'visitor-list/history', component: HistoryComponent },
  { path: 'visitor-list/ids', component: IdsComponent },
  { path: 'visitor-list/items-carried', component: ItemsCarriedComponent },
  {
    path: 'status/visitor-appointment',
    component: VisitorAppointmentStatusComponent,
  },
  { path: 'status/on-gate', component: OnGateComponent },
  { path: 'blacklist/add', component: AddBlacklistComponent },
  { path: 'blacklist/view', component: ViewBlacklistComponent },
  { path: 'admin/add-user', component: AddUserComponent },
  { path: 'admin/edit-user', component: ModifyUserComponent },
  { path: 'admin/change-password', component: ChangePasswordComponent },
  { path: 'admin/add-role', component: AddRoleComponent },
  { path: 'admin/edit-role', component: EditRoleComponent },
  { path: 'admin/unit-wise-details', component: UnitWiseDetailsComponent },
  { path: 'admin/add-employee', component: AddEmployeeComponent },
  {
    path: 'admin/appointment-approval',
    component: AppointmentApprovalComponent,
  },
  { path: 'admin/department-master', component: DepartmentMasterComponent },
  { path: 'green-channel', component: GreenChannelComponent },
  { path: 'check-out', component: PagesCheckOutComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
