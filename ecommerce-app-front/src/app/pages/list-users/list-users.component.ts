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

  view(id?: number) { if (id) this.router.navigate(['/dashboard/users/detail', id]); }
  edit(id?: number) { if (id) this.router.navigate(['/dashboard/users/edit', id]); }

  delete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar usuario?')) return;
    this.userSvc.delete(id).subscribe({
      next: () => this.load(),
      error: err => { alert('Error al borrar usuario'); console.error(err); }
    });
  }
}
