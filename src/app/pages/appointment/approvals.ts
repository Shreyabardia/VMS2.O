import { Component } from '@angular/core';

@Component({
  selector: 'app-approvals',
  template: `
    <div class="flex items-center justify-center min-h-[300px]">
      <p class="text-red-600 text-2xl font-bold text-center">
        You are not authorized to access this page!
      </p>
    </div>
  `,
  styles: '',
})
export class ApprovalsComponent {}
