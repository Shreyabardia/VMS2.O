import { Component } from '@angular/core';

@Component({
  selector: 'app-backside',
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          EAR Declaration
        </h1>
        <p class="text-gray-600 mt-1">
          Print the EAR (Export Administration Regulations) declaration form
        </p>
      </div>

      <!-- Information Card -->
      <div class="glass-effect rounded-xl p-6 border-l-4 border-blue-500">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-info-circle text-blue-600"></i>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              EAR Declaration Information
            </h3>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>All visitors must sign the EAR declaration form</span>
              </li>
              <li class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>Form must be completed before facility access</span>
              </li>
              <li class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                <span>Keep a copy for your records</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Print Section -->
      <div class="glass-effect rounded-xl p-6 lg:p-8">
        <div class="text-center space-y-6">
          <div class="flex justify-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-file-pdf text-blue-600 text-2xl"></i>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              TASL EAR Declaration Form
            </h3>
            <p class="text-gray-600">
              Click the button below to open and print the EAR declaration form
            </p>
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              (click)="printEAR()"
              class="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <i class="fas fa-print"></i>
              <span>Print EAR Form</span>
            </button>

            <button
              (click)="downloadEAR()"
              class="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              <i class="fas fa-download"></i>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="glass-effect rounded-xl p-6 border-l-4 border-green-500">
        <h3
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"
        >
          <i class="fas fa-clipboard-list text-green-500"></i>
          <span>Printing Instructions</span>
        </h3>
        <ol class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start space-x-2">
            <span
              class="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
              >1</span
            >
            <span>Click "Print EAR Form" to open the PDF in a new tab</span>
          </li>
          <li class="flex items-start space-x-2">
            <span
              class="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
              >2</span
            >
            <span>Use your browser's print function (Ctrl+P or Cmd+P)</span>
          </li>
          <li class="flex items-start space-x-2">
            <span
              class="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
              >3</span
            >
            <span>Ensure the form is printed on A4 paper</span>
          </li>
          <li class="flex items-start space-x-2">
            <span
              class="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
              >4</span
            >
            <span>Have the visitor sign the printed form</span>
          </li>
        </ol>
      </div>
    </div>
  `,
  styles: '',
})
export class BacksideComponent {
  printEAR() {
    const url = 'https://example.com/';
    window.open(url, '_blank');
  }

  downloadEAR() {
    const url = 'https://example.com/';
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TASL_EAR_Declaration.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
