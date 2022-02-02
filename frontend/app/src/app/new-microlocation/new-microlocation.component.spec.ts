import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMicrolocationComponent } from './new-microlocation.component';

describe('NewMicrolocationComponent', () => {
  let component: NewMicrolocationComponent;
  let fixture: ComponentFixture<NewMicrolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMicrolocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMicrolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
