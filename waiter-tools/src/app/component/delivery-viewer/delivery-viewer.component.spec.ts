import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryViewerComponent } from './delivery-viewer.component';

describe('DeliveryViewerComponent', () => {
  let component: DeliveryViewerComponent;
  let fixture: ComponentFixture<DeliveryViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
