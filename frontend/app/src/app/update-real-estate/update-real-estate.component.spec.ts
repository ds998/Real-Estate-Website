import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRealEstateComponent } from './update-real-estate.component';

describe('UpdateRealEstateComponent', () => {
  let component: UpdateRealEstateComponent;
  let fixture: ComponentFixture<UpdateRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRealEstateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
