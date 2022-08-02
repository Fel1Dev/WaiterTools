import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthenticationService, DeliveryDataService } from 'src/app/services';
import { AppConstants } from 'src/app/shared/appConstants';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent implements OnInit {
  //totalDelivery: BehaviorSubject<string> = new BehaviorSubject<string>('');
  totalDelivery: number = 0;
  selector: boolean = true;
  viewer: boolean = false;
  dateSelected!: string;
  deliveryList: any[] = [];
  deliveryProcessor!: FormGroup;
  loading = false;
  submitted = false;
  currentDate!: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private deliveryDataService: DeliveryDataService,
    private authenticationService: AuthenticationService    
  ) {}

  ngOnInit(): void {
    this.currentDate = moment().format(AppConstants.DATE_FORMAT);
    this.deliveryProcessor = this.formBuilder.group({
      dateProcess: [this.currentDate, Validators.required],
    });
  }

  get f() {
    return this.deliveryProcessor.controls;
  }

  OnSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.deliveryProcessor.invalid) {
      return;
    }
    this.loading = true;
    const componentDate = this.f['dateProcess'].value;

    // stop if bad date
    if (componentDate > this.currentDate) {
      this.deliveryProcessor.controls['dateProcess'].setErrors({
        futureDate: 'true',
      });
      this.loading = false;
      return;
    }
    this.selector = false;
    this.viewer = true;
    this.dateSelected = componentDate;
    this.getRecords();
  }

  getRecords() {
    this.loading = true;
    if (this.dateSelected) {
      const tokenValue = this.authenticationService.tokenValue;
      const restaurantId = tokenValue.currentRestaurantId;
      this.deliveryDataService
        .getCallcenterReport(this.dateSelected, restaurantId)
        .subscribe({
          next: (rawData: any) => {            
            this.deliveryList = this.deliveryDataService.processRecords(
              rawData.data
            );            
            this.totalDelivery = rawData.totalDelivery;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.error = err;
          },
        });
    }
  }

  restart() {
    this.viewer = false;
    this.selector = true;
    this.submitted = false;
    this.deliveryList = [];
    this.totalDelivery = 0;
  }
}
