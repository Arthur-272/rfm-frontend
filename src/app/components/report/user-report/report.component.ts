import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../report.service';
import { ICatch, IRelease, IReportEntry, IUser } from '../../../interface';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  fullEntries: IReportEntry[] = [];
  halfEntries: IReportEntry[] = [];
  errorMessage: string = '';
  currentUser: IUser | undefined;

  constructor(private reportService: ReportService, private authService: AuthService) {
    this.authService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  ngOnInit(): void {
    this.reportService.getReportDataForUser().subscribe({
      next: (data) => {
        this.processData(data.catches, data.releases);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching report data';
        console.error('Error:', error);
      },
    });
  }

  processData(catches: ICatch[], releases: IRelease[]): void {
    if (!this.currentUser) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    const fullEntriesMap = new Map<string, IReportEntry>();
    const halfEntriesMap = new Map<string, IReportEntry>();
    const processedReleaseIds = new Set<string>();

    // Process catches
    catches.forEach((catchInfo) => {
      const isCatchByUser = catchInfo.user.username === this.currentUser?.username;
      const isReleaseByUser = catchInfo.releaseInfo?.user.username === this.currentUser?.username;

      const key = catchInfo.id; // Use catch ID as the key

      if (isCatchByUser && isReleaseByUser) {
        // Full entry
        fullEntriesMap.set(key, {
          catchInfo,
          releaseInfo: catchInfo.releaseInfo!,
          type: 'full',
          vehicle: catchInfo.vehicle,
          property: catchInfo.property,
        });
        if (catchInfo.releaseInfo) {
          processedReleaseIds.add(catchInfo.releaseInfo.id);
        }
      } else if (isCatchByUser || isReleaseByUser) {
        // Half entry
        const vehicle = isCatchByUser ? catchInfo.vehicle : catchInfo.releaseInfo!.vehicle;
        const property = isCatchByUser ? catchInfo.property : catchInfo.releaseInfo!.property;

        halfEntriesMap.set(key, {
          catchInfo: isCatchByUser ? catchInfo : null,
          releaseInfo: isReleaseByUser ? catchInfo.releaseInfo : null,
          type: 'half',
          vehicle,
          property,
        });
        if (catchInfo.releaseInfo && isReleaseByUser) {
          processedReleaseIds.add(catchInfo.releaseInfo.id);
        }
      }
    });

    // Process releases not associated with a catch
    releases.forEach((releaseInfo) => {
      const isReleaseByUser = releaseInfo.user.username === this.currentUser?.username;

      // Skip releases that have already been processed
      if (isReleaseByUser && !processedReleaseIds.has(releaseInfo.id)) {
        const key = releaseInfo.id; // Use release ID as the key

        // Check if this release is already in halfEntriesMap (unlikely but for safety)
        if (!halfEntriesMap.has(key)) {
          // Create a half entry with only release info
          halfEntriesMap.set(key, {
            catchInfo: null,
            releaseInfo,
            type: 'half',
            vehicle: releaseInfo.vehicle,
            property: releaseInfo.property,
          });
        }
      }
    });

    // Convert maps to arrays
    this.fullEntries = Array.from(fullEntriesMap.values());
    this.halfEntries = Array.from(halfEntriesMap.values());
  }

}
