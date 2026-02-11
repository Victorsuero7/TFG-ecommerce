import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {
  error: string | null = null;
  loading = false;
  submitting = false;
  form!: FormGroup;
  toastMessage: string | null = null;
  toastVariant: 'primary' | 'success' | 'danger' = 'primary';
  toastVisible = false;
    
  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router
  ){
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    
    this.form.get('password')?.valueChanges.subscribe(() => this.checkPasswords());
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => this.checkPasswords());
  }

  onSubmit() {
    this.error = null;  
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { confirmPassword, ...payload } = this.form.value; 
    this.userSvc.signUp(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard']);
        this.showToast('Usuario registrado exitosamente', 'success');
      },
        error: (err) => {
        this.submitting = false;
        const msg = err?.error?.message || 'Error al registrar usuario';
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

  private checkPasswords() {
    const pwd = this.form.get('password')?.value;
    const cpControl = this.form.get('confirmPassword');
    if (!cpControl) return;
    const cp = cpControl.value;

    if (!cp) {
      if (cpControl.hasError('Las contraseñas no coinciden')) {
        const errors = { ...cpControl.errors };
        delete (errors as any).mismatch;
        if (Object.keys(errors).length === 0) cpControl.setErrors(null);
        else cpControl.setErrors(errors);
      }
      return;
    }

    if (pwd !== cp) {
      cpControl.setErrors({ ...(cpControl.errors || {}), mismatch: true });
    } else {
      if (cpControl.hasError('Las contraseñas no coinciden')) {
        const errors = { ...cpControl.errors };
        delete (errors as any).mismatch;
        if (Object.keys(errors).length === 0) cpControl.setErrors(null);
        else cpControl.setErrors(errors);
      }
    }
  }

  goToLogin() { this.router.navigate(['/login']); }
  hideToast() { this.toastVisible = false; }
};
