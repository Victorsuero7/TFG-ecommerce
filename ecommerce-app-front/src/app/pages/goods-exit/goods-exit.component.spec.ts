import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GoodsExitComponent } from './goods-exit.component';

describe('GoodsExitComponent', () => {
  let component: GoodsExitComponent;
  let fixture: ComponentFixture<GoodsExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsExitComponent, HttpClientTestingModule, RouterTestingModule]
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
