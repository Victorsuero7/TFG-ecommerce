import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of, switchMap, debounceTime, distinctUntilChanged, catchError, forkJoin, map } from 'rxjs';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  searchField: 'all' | 'name' | 'description' = 'all';
  isViewOnly = false;

  private search$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(private categorySvc: CategoryService, private router: Router, private authSvc: AuthService) {}

  ngOnInit(): void {
    this.isViewOnly = this.authSvc.isViewOnly();

    this.load();
    this.searchSub = this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return this.categorySvc.getAll();
        }
        this.loading = true;
        if (this.searchField === 'name') {
          return this.categorySvc.searchByName(term).pipe(catchError(() => of([])));
        }
        if (this.searchField === 'description') {
          return this.categorySvc.searchByDescription(term).pipe(catchError(() => of([])));
        }
        return forkJoin([
          this.categorySvc.searchByName(term).pipe(catchError(() => of([]))),
          this.categorySvc.searchByDescription(term).pipe(catchError(() => of([])))
        ]).pipe(
          map(([byName, byDesc]) => {
            const merged = new Map<number, Category>();
            for (const c of [...byName, ...byDesc]) {
              if (c.id != null) merged.set(c.id, c);
            }
            return Array.from(merged.values());
          })
        );
      })
    ).subscribe({
      next: data => { this.categories = data || []; this.loading = false; },
      error: () => { this.error = 'Error en la búsqueda'; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.categorySvc.getAll().subscribe({
      next: data => { this.categories = data || []; this.loading = false; },
      error: err => { console.error('Frontend: error fetching categories', err); this.error = 'Error cargando categorías'; this.loading = false; }
    });
  }

  onSearch(): void {
    this.search$.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search$.next('');
  }

  view(id?: number) { if (id) this.router.navigate(['/categories/detail/', id]); }
  edit(id?: number) {
    if (this.isViewOnly) return;
    if (id) this.router.navigate(['/categories/edit/', id]);
  }

  
}
