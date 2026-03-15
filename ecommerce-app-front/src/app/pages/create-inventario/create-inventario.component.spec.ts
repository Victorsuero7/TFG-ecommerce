import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CreateInventarioComponent } from './create-inventario.component';

describe('CreateInventarioComponent', () => {
  let component: CreateInventarioComponent;
  let fixture: ComponentFixture<CreateInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInventarioComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
