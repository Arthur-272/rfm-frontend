import { Component, OnInit } from '@angular/core';
import { ICatch } from '../../interface';
import { CatchService } from '../catch/catch.service';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For date adapter
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NgIf, NgForOf } from '@angular/common';
import {ReleaseConfirmationDialogComponent} from './release-component-dialog/release-component-dialog.component';
import {
  RemoveAcknowledgmentDialogComponent
} from './remove-acknowledgement-dialog/remove-acknowledgement-dialog.component';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
})
export class LiveComponent implements OnInit {
  caughtVehicles: ICatch[] = [];
  isFlipped: boolean[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  today: Date = new Date();

  constructor(private catchService: CatchService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchCaughtVehicles();
  }

  fetchCaughtVehicles(): void {
    this.catchService.liveCatches().subscribe({
      next: (catchInfo: ICatch[]) => {
        this.caughtVehicles = catchInfo;
        this.isFlipped = new Array(catchInfo.length).fill(false);
        if (this.caughtVehicles.length <= 0) {
          this.setErrorMessage('There are no booted vehicles');
        } else {
          // Optionally, clear any existing error message
          this.clearErrorMessage();
        }
      },
      error: (error) => {
        this.setErrorMessage(error.error);
        console.error('Error fetching live catches:', error);
      },
    });
  }

  flipCard(index: number) {
    this.isFlipped[index] = !this.isFlipped[index];
  }


  releaseCatch(catchInfo: ICatch, releaseDate: Date | null): void {
    const payload = {
      property: {
        id: catchInfo.property.id,
      },
      vehicle: {
        numberPlate: catchInfo.vehicle.numberPlate,
        model: catchInfo.vehicle.model,
        color: catchInfo.vehicle.color
      },
      timestamp: releaseDate ? releaseDate.toISOString() : new Date().toISOString(),
    }

    this.catchService.releaseVehicle(payload).subscribe({
      next: (data: ICatch) => {
        this.setSuccessMessage(`Released vehicle ${data.vehicle.numberPlate} successfully.`);
        this.clearErrorMessage();
        this.fetchCaughtVehicles(); // Refresh the list
      },
      error: (error) => {
        this.setErrorMessage(error.error.split(":")[1] || 'Error releasing vehicle.');
        this.clearSuccessMessage();
      }
    });
  }

  removeCatch(catchInfo: ICatch): void {
    this.catchService.removeCatch(catchInfo).subscribe({
      next: () => {
        this.setSuccessMessage(`Removed vehicle ${catchInfo.vehicle.numberPlate} successfully.`);
        this.clearErrorMessage();
        this.fetchCaughtVehicles(); // Refresh the list
      },
      error: (error) => {
        this.setErrorMessage(error.error.split(":")[1] || 'Error removing vehicle.');
        this.clearSuccessMessage();
      }
    });
  }

  openRemoveDialog(catchInfo: ICatch): void {
    const dialogRef = this.dialog.open(RemoveAcknowledgmentDialogComponent, {
      width: '350px',
      data: { catchInfo } // Pass the catchInfo if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeCatch(catchInfo);
      }
    });
  }


  openReleaseDialog(catchInfo: ICatch): void {
    const dialogRef = this.dialog.open(ReleaseConfirmationDialogComponent, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      data: { catchInfo } // Pass the catchInfo if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // result contains the selected release date or null
        this.releaseCatch(catchInfo, result);
      }
    });
  }

  /**
   * Sets the success message and clears it after 3 seconds.
   * @param message The success message to display.
   */
  private setSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /**
   * Sets the error message and clears it after 3 seconds.
   * @param message The error message to display.
   */
  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  /**
   * Clears the success message immediately.
   */
  private clearSuccessMessage(): void {
    this.successMessage = '';
  }

  /**
   * Clears the error message immediately.
   */
  private clearErrorMessage(): void {
    this.errorMessage = '';
  }
}
