import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {
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
      name: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator.bind(this)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)]],
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
      next: (res: any) => {
        this.submitting = false;
        if (res?.token) this.authSvc.login(res.token);
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
      if (cpControl.hasError('mismatch')) {
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
      if (cpControl.hasError('mismatch')) {
        const errors = { ...cpControl.errors };
        delete (errors as any).mismatch;
        if (Object.keys(errors).length === 0) cpControl.setErrors(null);
        else cpControl.setErrors(errors);
      }
    }
  }

  private emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.hasError('email')) {
      console.log('Email vacío o formato inválido:', control.value);
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(400),
      switchMap(email => {
        console.log('Comprobando email:', email);
        return this.userSvc.checkEmail(email).pipe(
          map(res => {
            console.log('Respuesta backend:', res);
            return res.exists ? { emailTaken: true } : null;
          }),
          catchError((err) => {
            console.log('Error backend:', err);
            return of(null);
          })
        );
      }),
      first()
    );
  }

  goToLogin() { this.router.navigate(['/login']); }
  hideToast() { this.toastVisible = false; }
};
