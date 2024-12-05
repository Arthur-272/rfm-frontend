// report.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';
import { ICatch, IReportEntry, IUser } from '../../../interface';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core'; // For date adapter

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnDestroy {
  fullEntries: IReportEntry[] = [];
  halfEntries: IReportEntry[] = [];
  errorMessage: string = '';
  currentUser: IUser | undefined;
  selectedDate: Date | null = null;

  // For restricting future dates
  today: Date = new Date();

  // Subscription management
  private subscriptions: Subscription = new Subscription();

  constructor(private reportService: ReportService, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to getCurrentUser and fetch data once user is retrieved
    const userSub = this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.currentUser = currentUser;
        if (this.currentUser) {
          this.fetchReportData();
        } else {
          this.errorMessage = 'User not logged in.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error retrieving user information.';
        console.error('Error fetching current user:', error);
      },
    });

    this.subscriptions.add(userSub);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Fetches report data based on the selected date.
   */
  fetchReportData(): void {

    const dateToSend = this.selectedDate
      ? this.adjustToBrowserTimezone(this.selectedDate)
      : this.adjustToBrowserTimezone(new Date());

    const reportSub = this.reportService.getReportDataForUser(dateToSend).subscribe({
      next: (data: ICatch[]) => {
        this.processData(data);
        this.errorMessage = ''; // Clear any previous error messages
      },
      error: (error) => {
        this.errorMessage = 'Error fetching report data.';
        console.error('Error fetching report data:', error);
      },
    });

    this.subscriptions.add(reportSub);
  }

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
    if (this.currentUser) {
      this.fetchReportData();
    } else {
      this.errorMessage = 'User not logged in.';
    }
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
      const isReleaseByUser = catchInfo.releaseInfo?.user.username === this.currentUser?.username;

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
          vehicle: isCatchByUser ? catchInfo.vehicle : catchInfo.releaseInfo?.vehicle,
          property: isCatchByUser ? catchInfo.property : catchInfo.releaseInfo?.property,
        });
      }
      // Entries where neither catch nor release is by the current user are ignored
    });

    // Assign the categorized entries to the component's properties
    this.fullEntries = Array.from(fullEntriesMap.values());
    this.halfEntries = Array.from(halfEntriesMap.values());
  }
}
