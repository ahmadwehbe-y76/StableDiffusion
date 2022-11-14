import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpaintingComponent } from './inpainting.component';

describe('InpaintingComponent', () => {
  let component: InpaintingComponent;
  let fixture: ComponentFixture<InpaintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpaintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpaintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
