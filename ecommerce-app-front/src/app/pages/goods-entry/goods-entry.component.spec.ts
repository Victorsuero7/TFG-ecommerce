import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GoodsEntryComponent } from './goods-entry.component';

describe('GoodsEntryComponent', () => {
  let component: GoodsEntryComponent;
  let fixture: ComponentFixture<GoodsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsEntryComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
