import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-processor',
  templateUrl: './delivery-processor.component.html',
  styleUrls: ['./delivery-processor.component.css'],
})
export class DeliveryProcessorComponent implements OnInit {
  deliveryProcessor!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
  ) {}  

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
    //Call report process
    //Change flag to show delivery-viewer component
  }
}
