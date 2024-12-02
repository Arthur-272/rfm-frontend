// report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';
import { ICatch, IReportEntry, IUser } from '../../../interface';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core'; // For date adapter

@Component({
  selector: 'app-report',
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
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  fullEntries: IReportEntry[] = [];
  halfEntries: IReportEntry[] = [];
  errorMessage: string = '';
  currentUser: IUser | undefined;
  selectedDate: Date | null = null;

  // For restricting future dates
  today: Date = new Date();

  constructor(private reportService: ReportService, private authService: AuthService) {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  ngOnInit(): void {
    this.fetchReportData();
  }

  /**
   * Fetches report data based on the selected date.
   */
  fetchReportData(): void {
    const dateISO = this.selectedDate ? this.selectedDate.toISOString() : new Date().toISOString();
    this.reportService.getReportDataForUser(dateISO).subscribe({
      next: (data: ICatch[]) => {
        this.processData(data);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching report data';
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
   * Processes the fetched catches to categorize them into full and half entries.
   * @param catches Array of ICatch
   */
  processData(catches: ICatch[]): void {
    if (!this.currentUser) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    const fullEntriesMap = new Map<string, IReportEntry>();
    const halfEntriesMap = new Map<string, IReportEntry>();

    catches.forEach((catchInfo) => {
      const isCatchByUser = catchInfo.user.username === this.currentUser?.username;
      const isReleaseByUser = catchInfo.releaseInfo.user.username === this.currentUser?.username;

      const key = catchInfo.id; // Unique identifier for the catch

      if (isCatchByUser && isReleaseByUser) {
        // Full Entry: Both catch and release by the current user
        fullEntriesMap.set(key, {
          catchInfo,
          releaseInfo: catchInfo.releaseInfo,
          type: 'full',
          vehicle: catchInfo.vehicle,
          property: catchInfo.property,
        });
      } else if (isCatchByUser || isReleaseByUser) {
        // Half Entry: Either catch or release by the current user
        halfEntriesMap.set(key, {
          catchInfo: isCatchByUser ? catchInfo : null,
          releaseInfo: isReleaseByUser ? catchInfo.releaseInfo : null,
          type: 'half',
          vehicle: isCatchByUser ? catchInfo.vehicle : catchInfo.releaseInfo.vehicle,
          property: isCatchByUser ? catchInfo.property : catchInfo.releaseInfo.property,
        });
      }
      // Entries where neither catch nor release is by the current user are ignored
    });

    // Assign the categorized entries to the component's properties
    this.fullEntries = Array.from(fullEntriesMap.values());
    this.halfEntries = Array.from(halfEntriesMap.values());
  }
}
