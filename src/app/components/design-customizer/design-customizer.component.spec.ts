import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCustomizerComponent } from './design-customizer.component';

describe('DesignCustomizerComponent', () => {
  let component: DesignCustomizerComponent;
  let fixture: ComponentFixture<DesignCustomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignCustomizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
