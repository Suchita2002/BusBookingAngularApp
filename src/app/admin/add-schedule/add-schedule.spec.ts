import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchedule } from './add-schedule';

describe('AddSchedule', () => {
  let component: AddSchedule;
  let fixture: ComponentFixture<AddSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
