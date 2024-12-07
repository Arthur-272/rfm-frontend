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

    let current = new Date();

    // Check current hour
    if (current.getHours() < 4) {
      // If it's before 4 AM, subtract one day
      current.setDate(current.getDate() - 1);
    }

    // Set time to 4:00 AM
    current.setHours(4, 0, 0, 0);

    const dateToSend = this.adjustToBrowserTimezone(current);

    this.reportService.getReportData(dateToSend).subscribe({
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
   * Adjusts a given date to match the browser's timezone.
   * @param date Date object to adjust
   * @returns ISO string of the adjusted date
   */
  adjustToBrowserTimezone(date: Date): string {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString();
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
