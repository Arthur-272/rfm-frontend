// src/app/dialogs/remove-acknowledgment-dialog/remove-acknowledgment-dialog.component.ts
import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-remove-acknowledgment-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  template: `
    <h2 mat-dialog-title>Remove Confirmation</h2>
    <mat-dialog-content>
      <p>Are you sure you want to remove this catch record?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onOk()">OK</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 250px;
    }
  `]
})
export class RemoveAcknowledgmentDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RemoveAcknowledgmentDialogComponent>
  ) {}

  onOk(): void {
    this.dialogRef.close(true);
  }
}
