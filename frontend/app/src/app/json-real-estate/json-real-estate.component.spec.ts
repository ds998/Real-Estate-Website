import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonRealEstateComponent } from './json-real-estate.component';

describe('JsonRealEstateComponent', () => {
  let component: JsonRealEstateComponent;
  let fixture: ComponentFixture<JsonRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonRealEstateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
