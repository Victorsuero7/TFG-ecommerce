import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
/**
 * Componente de inicio de sesión.
 * Gestiona el formulario de login, valida credenciales y redirige al dashboard tras autenticarse correctamente.
 */
export class UserLoginComponent {
error: string | null = null;
  loading = true;
  submitting = false;
  form!: FormGroup;
  toastMessage: string | null = null;
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';
  toastVisible = false;

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router,
    private authSvc: AuthService
  ){
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const authToast = localStorage.getItem('auth_redirect_toast');
        if (authToast) {
          this.showToast(authToast, 'error');
          localStorage.removeItem('auth_redirect_toast');
        }
      }
    }, 0);
  }
  onSubmit() {
    this.error = null;  
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const payload  = this.form.value; 
    this.userSvc.login(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        if (res?.token) this.authSvc.login(res.token);
        this.router.navigate(['/dashboard']);
        this.showToast('Has accedido exitosamente', 'success');
      },
        error: (err) => {
        this.submitting = false;
        const msg = err?.error?.message || 'Error al iniciar sesión';
        this.showToast(msg, 'error');
      }
    })
  }
    showToast(message: string, kind: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastVariant = kind === 'success' ? 'success' : (kind === 'error' ? 'danger' : 'primary');
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }
  goToRegister() { this.router.navigate(['/register']); }
  hideToast() { this.toastVisible = false; }
}
