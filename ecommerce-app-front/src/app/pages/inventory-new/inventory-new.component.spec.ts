import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryNewComponent } from './inventory-new.component';

describe('InventoryNewComponent', () => {
  let component: InventoryNewComponent;
  let fixture: ComponentFixture<InventoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
