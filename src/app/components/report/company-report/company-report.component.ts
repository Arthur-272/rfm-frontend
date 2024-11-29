import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ICatch, ICompanyReportEntry} from '../../../interface';
import {ReportService} from '../report.service';

@Component({
  selector: 'app-company-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-report.component.html',
  styleUrls: ['./company-report.component.css'],
})
export class CompanyReportComponent implements OnInit {
  reportEntries: ICompanyReportEntry[] = [];
  errorMessage: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getReportData().subscribe({
      next: (data) => {
        this.processData(data);
      },
      error: (error) => {
        this.errorMessage = 'Error fetching company report data';
        console.error('Error:', error);
      },
    });
  }

  processData(catches: ICatch[]): void {
    this.reportEntries = catches.map((catchInfo) => ({
      catchInfo,
      releaseInfo: catchInfo.releaseInfo,
    }));
  }
}
