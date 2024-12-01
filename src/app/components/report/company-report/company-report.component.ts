// company-report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICatch, ICompanyReportEntry } from '../../../interface';
import { ReportService } from '../report.service';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core'; // For date adapter

@Component({
  selector: 'app-company-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.css'],
})
export class CompanyReportComponent implements OnInit {
  reportEntries: ICompanyReportEntry[] = [];
  errorMessage: string = '';

  // Date Picker Properties
  selectedDate: Date | null = null;
  today: Date = new Date();

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  /**
   * Fetches report data based on the selected date.
   */
  fetchReportData(): void {
    const dateISO = this.selectedDate ? this.selectedDate.toISOString() : new Date().toISOString();
    this.reportService.getReportData(dateISO).subscribe({
      next: (data: ICatch[]) => {
        this.processData(data);
        this.errorMessage = ''; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = 'Error fetching company report data';
        console.error('Error:', error);
      },
    });
  }

  /**
   * Handler for date change event.
   * @param event MatDatepickerInputEvent<Date>
   */
  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.fetchReportData();
  }

  /**
   * Processes the fetched catches to format them for the report.
   * @param catches Array of ICatch
   */
  processData(catches: ICatch[]): void {
    this.reportEntries = catches.map((catchInfo) => ({
      catchInfo,
      releaseInfo: catchInfo.releaseInfo,
    }));
  }
}
