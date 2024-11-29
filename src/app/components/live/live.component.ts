import { Component, OnInit } from '@angular/core';
import {ICatch, IProperty, IRelease, IVehicle} from '../../interface';
import { CatchService } from '../catch/catch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
})
export class LiveComponent implements OnInit {
  caughtVehicles: ICatch[] = [];
  isFlipped: boolean[] = [];
  errorMessage: string = '';

  constructor(private catchService: CatchService) {}

  ngOnInit(): void {
    this.catchService.liveCatches().subscribe({
      next: (catchInfo: ICatch[]) => {
        this.caughtVehicles = catchInfo;
        this.isFlipped = new Array(catchInfo.length).fill(false);
        if (this.caughtVehicles.length <= 0) {
          this.errorMessage = 'There are no booted vehicles';
        }
      },
      error: (error) => {
        this.errorMessage = error.error;
        console.error('Error fetching live catches:', error);
      },
    });
  }

  flipCard(index: number) {
    this.isFlipped[index] = !this.isFlipped[index];
  }

  releaseCatch(catchInfo: ICatch) {
    // Implement release functionality
    const releaseInfo : { property: IProperty; vehicle: IVehicle } = {
      vehicle : catchInfo.vehicle,
      property: catchInfo.property,
    }
    this.catchService.releaseVehicle(releaseInfo).subscribe({
      next: (catchInfo: ICatch) => {
        window.alert("Release vehicle " + catchInfo.vehicle.numberPlate);
        this.ngOnInit();
      },
      error: (error) => {
        this.errorMessage = error.error;
      }
    });
    console.log('Release catch', catchInfo);
  }

  removeCatch(catchInfo: ICatch) {
    // Implement remove functionality
    this.catchService.removeCatch(catchInfo).subscribe({
      next: () => {
        window.alert("Removed vehicle ");
        this.ngOnInit();
      },
      error: (error: { error: string; }) => {
        this.errorMessage = error.error;
        console.log('Error removing vehicle ', this.errorMessage);
      }
    })
  }
}
