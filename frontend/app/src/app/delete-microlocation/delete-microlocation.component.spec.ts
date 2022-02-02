import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMicrolocationComponent } from './delete-microlocation.component';

describe('DeleteMicrolocationComponent', () => {
  let component: DeleteMicrolocationComponent;
  let fixture: ComponentFixture<DeleteMicrolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMicrolocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMicrolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
