import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of, switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs';
import { MovementService } from '../../services/movement/movement.service';
import { Movement } from '../../models/movement.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit, OnDestroy {
  movements: Movement[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  private search$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(private movementSvc: MovementService) {}

  ngOnInit(): void {
    this.load();

    this.searchSub = this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return this.movementSvc.getAll();
        }
        this.loading = true;
        return this.movementSvc.searchByProductName(term).pipe(catchError(() => of([])));
      })
    ).subscribe({
      next: data => { this.movements = data; this.loading = false; },
      error: () => { this.error = 'Error en la búsqueda'; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.movementSvc.getAll().subscribe({
      next: data => {
        this.movements = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando movimientos', err);
        this.error = 'Error cargando movimientos';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.search$.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search$.next('');
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
