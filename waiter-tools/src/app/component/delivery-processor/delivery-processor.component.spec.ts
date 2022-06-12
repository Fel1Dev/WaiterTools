import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryProcessorComponent } from './delivery-processor.component';

describe('DeliveryProcessorComponent', () => {
  let component: DeliveryProcessorComponent;
  let fixture: ComponentFixture<DeliveryProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryProcessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
