import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRealEstateComponent } from './new-real-estate.component';

describe('NewRealEstateComponent', () => {
  let component: NewRealEstateComponent;
  let fixture: ComponentFixture<NewRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRealEstateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
