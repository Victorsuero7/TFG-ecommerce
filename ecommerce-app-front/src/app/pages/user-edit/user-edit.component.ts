import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
/**
 * Componente para editar los datos de un usuario existente.
 * Precarga los campos del usuario desde la API y permite actualizar nombre,
 * apellido, email, teléfono y fecha de nacimiento.
 */
export class UserEditComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;
  loading = true;
  userId?: number;
  currentRole: UserRole | '-' = '-';
  canEditRole = false;
  readonly roleOptions: UserRole[] = ['ADMIN', 'ROOT', 'USER', 'VIEW_ONLY'];
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      birthDate: [''],
      role: ['USER']
    });
  }

  ngOnInit(): void {
    const loggedRole = this.getLoggedRole();
    this.canEditRole = loggedRole === 'ADMIN' || loggedRole === 'ROOT';

    this.route.params.subscribe(params => {
      this.userId = Number(params['id']);
      if (this.userId) {
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userSvc.getById(id).subscribe({
      next: (resp: any) => {
        let u = resp;
        if (u && typeof u === 'object') {
          if ('message' in u && u.message && typeof u.message === 'object' && 'result' in u.message) {
            u = u.message.result;
          } else if ('result' in u) {
            u = u.result;
          }
        }
        this.form.patchValue({
          name: u?.name ?? '',
          lastName: u?.lastName ?? '',
          email: u?.email ?? '',
          phoneNumber: u?.phoneNumber ?? '',
          birthDate: u?.birthDate ? this.formatDateForInput(u.birthDate) : '',
          role: u?.role ?? 'USER'
        });
        this.currentRole = u?.role ?? '-';
        this.loading = false;
      },
      error: err => {
        this.error = 'Error cargando usuario';
        this.loading = false;
      }
    });
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  submit(): void {
    if (this.form.invalid || !this.userId) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload: any = {
      ...this.form.value,
      id: this.userId
    };

    if (!this.canEditRole) {
      delete payload.role;
    }

    this.userSvc.update(this.userId, payload).subscribe({
      next: () => {
        this.showToast('Usuario actualizado', 'success');
        setTimeout(() => this.router.navigate(['/users/list']), 800);
        this.loading = false;
      },
      error: err => {
        this.showToast('Error al actualizar usuario', 'error');
        this.loading = false;
      }
    });
  }

  showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  private getLoggedRole(): UserRole | null {
    const token = this.authSvc.getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(atob(base64 + padding));
      const role = payload?.role as UserRole | undefined;
      return this.roleOptions.includes(role as UserRole) ? (role as UserRole) : null;
    } catch {
      return null;
    }
  }

  hideToast() { this.toastVisible = false; }
}