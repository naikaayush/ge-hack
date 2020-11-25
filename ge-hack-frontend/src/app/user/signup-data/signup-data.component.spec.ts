import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDataComponent } from './signup-data.component';

describe('SignupDataComponent', () => {
  let component: SignupDataComponent;
  let fixture: ComponentFixture<SignupDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
