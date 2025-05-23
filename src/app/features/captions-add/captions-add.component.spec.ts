import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionsAddComponent } from './captions-add.component';

describe('CaptionsAddComponent', () => {
  let component: CaptionsAddComponent;
  let fixture: ComponentFixture<CaptionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptionsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
