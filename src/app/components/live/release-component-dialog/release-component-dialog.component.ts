// src/app/dialogs/release-confirmation-dialog/release-confirmation-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-release-confirmation-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent
  ],
  template: `
    <h2 mat-dialog-title>Confirm Release</h2>
    <mat-dialog-content>
      <form [formGroup]="releaseForm" (ngSubmit)="onConfirm()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Select Release Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            placeholder="Choose a date"
            formControlName="releaseDate"
            [max]="today"
          />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <p>Are you sure you want to release this vehicle?</p>
        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-button color="primary" type="submit">Confirm</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 300px;
    }

  `]
})
export class ReleaseConfirmationDialogComponent implements OnInit {
  releaseForm: FormGroup;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReleaseConfirmationDialogComponent>
  ) {
    this.releaseForm = this.fb.group({
      releaseDate: [null]
    });
  }

  ngOnInit(): void {}

  onConfirm(): void {
    const releaseDate = this.releaseForm.get('releaseDate')?.value;
    console.log(releaseDate);
    this.dialogRef.close(releaseDate);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
