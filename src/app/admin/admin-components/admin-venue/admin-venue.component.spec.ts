import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVenueComponent } from './admin-venue.component';

describe('AdminVenueComponent', () => {
  let component: AdminVenueComponent;
  let fixture: ComponentFixture<AdminVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
