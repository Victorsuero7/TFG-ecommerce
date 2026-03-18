import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';

  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  PAGE_SIZE = 10;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  pages: number[] = [];

  selectedDeleteId?: number;
  canManageUsers = false;

  constructor(private userSvc: UserService, private router: Router, private authSvc: AuthService) {}

  ngOnInit(): void {
    this.canManageUsers = this.authSvc.hasAnyRole(['ADMIN']);
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    
    this.userSvc.getAllPaginated(this.currentPage).subscribe({
      next: ({ data, totalCount }) => { 
              const list = (data || []).map((p: any) => ({
                ...p ?? null
              }));

              this.users = list;
              this.totalCount = totalCount;
              this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.PAGE_SIZE));
              this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
              this.loading = false;
      
      },
      error: err => { this.error = 'Error cargando usuarios'; this.loading = false; console.error(err); }
    });
  }

  fullName(u: User) {
    return `${u.name} ${u.lastName}`;
  }

  formatDate(d?: string | Date | null) {
    if (!d) return '-';
    const dt = d instanceof Date ? d : new Date(d);
    return isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString();
  }


  view(id?: number) {
    console.log('Ver usuario', id);
    if (id) this.router.navigate(['/user/detail', id]);
  }

  edit(id?: number) {
    if (!this.canManageUsers) return;
    console.log('Editar usuario', id);
    if (id) this.router.navigate(['/user/edit', id]);
  }

  
  openDeleteModal(id?: number) {
    if (!this.canManageUsers) return;
    console.log('Abrir modal borrar usuario', id);
    if (!id) return;
    this.selectedDeleteId = id;
  }

  confirmDelete() {
    if (!this.canManageUsers) return;
    const id = this.selectedDeleteId;
    if (!id) return;
    this.userSvc.softdelete(id).subscribe({
      next: () => {
        this.showToast('Usuario desactivado correctamente', 'success');
        this.load();
        this.selectedDeleteId = undefined;
      },
      error: err => {
        this.showToast('Error al desactivar usuario', 'error');
        console.error(err);
        this.selectedDeleteId = undefined;
      }
    });
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.load();
  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  hideToast() { this.toastVisible = false; }
}
