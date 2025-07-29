import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/index';
import { RegistrationComponent } from './pages/visitor-registration/registration';
import { GatePassComponent } from './pages/visitor-registration/gate-pass';
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
import { MonthlyListComponent } from './pages/visitor-list/monthly-list';
import { OnGateAppointmentStatusComponent } from './pages/status/on-gate-appointment-status';
import { OnMyApprovalsComponent } from './pages/appointment/on-my-approvals';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'visitor-registration/register', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'visitor-registration/gate-pass', component: GatePassComponent, canActivate: [AuthGuard] },
  { path: 'visitor-registration/backside', component: BacksideComponent, canActivate: [AuthGuard] },
  { path: 'appointment/schedule', component: AppointmentScheduleComponent, canActivate: [AuthGuard] },
  { path: 'appointment/view', component: ViewAppointmentComponent, canActivate: [AuthGuard] },
  { path: 'appointment/approvals', component: ApprovalsComponent, canActivate: [AuthGuard] },
  { path: 'appointment/on-my-approvals', component: OnMyApprovalsComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/checked-in', component: CheckedInComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/checked-out', component: CheckedOutComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/details', component: DetailsComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/ids', component: IdsComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/items-carried', component: ItemsCarriedComponent, canActivate: [AuthGuard] },
  { path: 'visitor-list/monthly-list', component: MonthlyListComponent, canActivate: [AuthGuard] },
  {
    path: 'status/visitor-appointment',
    component: VisitorAppointmentStatusComponent,
    canActivate: [AuthGuard]
  },
  { path: 'status/on-gate', component: OnGateComponent, canActivate: [AuthGuard] },
  { path: 'status/on-gate-appointment-status', component: OnGateAppointmentStatusComponent, canActivate: [AuthGuard] },
  { path: 'blacklist/add', component: AddBlacklistComponent, canActivate: [AuthGuard] },
  { path: 'blacklist/view', component: ViewBlacklistComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'admin/edit-user', component: ModifyUserComponent, canActivate: [AuthGuard] },
  { path: 'admin/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-role', component: AddRoleComponent, canActivate: [AuthGuard] },
  { path: 'admin/edit-role', component: EditRoleComponent, canActivate: [AuthGuard] },
  { path: 'admin/unit-wise-details', component: UnitWiseDetailsComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-employee', component: AddEmployeeComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/appointment-approval',
    component: AppointmentApprovalComponent,
    canActivate: [AuthGuard]
  },
  { path: 'admin/department-master', component: DepartmentMasterComponent, canActivate: [AuthGuard] },
  { path: 'green-channel', component: GreenChannelComponent, canActivate: [AuthGuard] },
  { path: 'check-out', component: PagesCheckOutComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
