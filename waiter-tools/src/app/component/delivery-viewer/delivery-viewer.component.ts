import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticationService, DeliveryDataService } from 'src/app/services';

@Component({
  selector: 'app-delivery-viewer',
  templateUrl: './delivery-viewer.component.html',
  styleUrls: ['./delivery-viewer.component.css'],
})
export class DeliveryViewerComponent implements OnInit {
  @Input() visible!: boolean;
  @Input() dateSelected!: string;
  constructor(
    private deliveryDataService: DeliveryDataService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log('Domi Viewer');
    this.getRecords();
  }

  getRecords() {
    if (this.dateSelected) {
      const tokenValue = this.authenticationService.tokenValue;
      const restaurantId =  tokenValue.restaruantId;
      this.deliveryDataService.getCallcenterReport(this.dateSelected, restaurantId)
      .subscribe(
        {
          next: (response: any) => {
            console.table(response);
          },
          error: () => {
            //this.error = this.error;
            //this.loading = false;
          },
        }
      );

    }
  }
}
