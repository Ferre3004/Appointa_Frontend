import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.error   = 'Email o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}