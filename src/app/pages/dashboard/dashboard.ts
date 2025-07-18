import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, NgClass, RouterModule],
})
export class DashboardComponent {
  constructor(private router: Router) {}

  currentDate = new Date();

  summaryCards = [
    { title: "Today's Visitors", value: 34, icon: 'users' },
    { title: 'Checked In', value: 21, icon: 'check' },
    { title: 'Checked Out', value: 13, icon: 'logout' },
    { title: 'Appointments', value: 8, icon: 'calendar' },
    { title: 'Blacklisted', value: 2, icon: 'ban' },
    { title: 'Active Users', value: 5, icon: 'user-group' },
  ];

  recentVisitors = [
    {
      name: 'Amit Sharma',
      company: 'Tata Steel',
      phone: '9876543210',
      checkIn: '09:15 AM',
      status: 'Checked In',
    },
    {
      name: 'Priya Singh',
      company: 'Infosys',
      phone: '9123456780',
      checkIn: '09:45 AM',
      status: 'Checked In',
    },
    {
      name: 'Rahul Verma',
      company: 'Wipro',
      phone: '9988776655',
      checkIn: '10:05 AM',
      status: 'Checked Out',
    },
    {
      name: 'Sunita Rao',
      company: 'L&T',
      phone: '9871234567',
      checkIn: '10:30 AM',
      status: 'Checked In',
    },
    {
      name: 'Vikas Gupta',
      company: 'Reliance',
      phone: '9876541230',
      checkIn: '11:00 AM',
      status: 'Checked Out',
    },
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'Checked In':
        return 'bg-green-100 text-green-800';
      case 'Checked Out':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCardIconBg(icon: string) {
    switch (icon) {
      case 'users':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'check':
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'logout':
        return 'bg-gradient-to-br from-yellow-500 to-orange-600';
      case 'calendar':
        return 'bg-gradient-to-br from-purple-500 to-indigo-600';
      case 'ban':
        return 'bg-gradient-to-br from-red-500 to-pink-600';
      case 'user-group':
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  }

  getFlowingGradientStyle(index: number, total: number) {
    const percent = (index / (total - 1)) * 100;
    return {
      'background': 'linear-gradient(90deg, #4D94D2 0%, #5ED3CB 54%, #65BE5A 100%)',
      'background-size': `${total * 100}% 100%`,
      'background-position': `${percent}% 0`,
    };
  }

  onRegisterVisitor() {
    // Navigation or logic for registering a visitor
    this.router.navigate(['/visitor-registration/register']);
  }

  onAddAppointment() {
    // Navigation or logic for adding an appointment
    this.router.navigate(['/appointment/schedule']);
  }

  onViewBlacklist() {
    // Navigation or logic for viewing blacklist
    this.router.navigate(['/blacklist/view']);
  }
}
