import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsExitComponent } from './goods-exit.component';

describe('GoodsExitComponent', () => {
  let component: GoodsExitComponent;
  let fixture: ComponentFixture<GoodsExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsExitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
