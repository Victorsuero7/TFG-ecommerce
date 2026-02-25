import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  selectedDeleteId?: number;

  constructor(private userSvc: UserService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.userSvc.getAll().subscribe({
      next: data => { this.users = data || []; this.loading = false; },
      error: err => { this.error = 'Error cargando usuarios'; this.loading = false; console.error(err); }
    });
  }

  fullName(u: User) {
    return `${u.name} ${u.lastName}`;
  }

  formatDate(d?: string | Date) {
    if (!d) return '-';
    const dt = d instanceof Date ? d : new Date(d);
    return isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString();
  }


  view(id?: number) {
    console.log('Ver usuario', id);
    if (id) this.router.navigate(['/user/detail', id]);
  }

  edit(id?: number) {
    console.log('Editar usuario', id);
    if (id) this.router.navigate(['/user/edit', id]);
  }

  
  openDeleteModal(id?: number) {
    console.log('Abrir modal borrar usuario', id);
    if (!id) return;
    this.selectedDeleteId = id;
  }

  confirmDelete() {
    const id = this.selectedDeleteId;
    if (!id) return;
    this.userSvc.softdelete(id).subscribe({
      next: () => {
        this.showToast('Usuario desactivado correctamente', 'success');
        this.load();
        this.selectedDeleteId = undefined;
      },
      error: err => {
        this.showToast('Error al desactivar producto', 'error');
        console.error(err);
        this.selectedDeleteId = undefined;
      }
    });
  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  hideToast() { this.toastVisible = false; }
}
