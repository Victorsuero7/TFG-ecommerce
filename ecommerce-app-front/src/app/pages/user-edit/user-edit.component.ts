import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  error: string | null = null;
  loading = true;
  userId?: number;
  toastVisible = false;
  toastMessage = '';
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private userSvc: UserService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
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
          birthDate: u?.birthDate ? this.formatDateForInput(u.birthDate) : ''
        });
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
    const payload = {
      ...this.form.value,
      id: this.userId
    };
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

  hideToast() { this.toastVisible = false; }
}