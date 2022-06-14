import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AppConstants } from 'src/app/shared/appConstants';

@Component({
  selector: 'app-delivery-processor',
  templateUrl: './delivery-processor.component.html',
  styleUrls: ['./delivery-processor.component.css'],
})
export class DeliveryProcessorComponent implements OnInit {
  @Input() visible!: boolean;
  @Output() dateSelected = new EventEmitter<Date>();
  deliveryProcessor!: FormGroup;
  loading = false;
  submitted = false;
  currentDate!: string;
  error = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.deliveryProcessor = this.formBuilder.group({
      dateProcess: ['', Validators.required],
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
    this.currentDate = moment().format(AppConstants.DATE_FORMAT);

    if (componentDate <= this.currentDate) {
      this.dateSelected.emit(componentDate);
      this.visible = false;
    } else {
      this.deliveryProcessor.controls['dateProcess'].setErrors({
        futureDate: 'true',
      });
      this.loading = false;
    }
  }
}
