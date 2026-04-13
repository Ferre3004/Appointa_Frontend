import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  paso = 1;
  loading = false;
  error = '';
  planSeleccionado = '';

  colores = [
    { hex: '#534AB7', nombre: 'Violeta' },
    { hex: '#0F6E56', nombre: 'Verde' },
    { hex: '#185FA5', nombre: 'Azul' },
    { hex: '#993C1D', nombre: 'Coral' },
    { hex: '#854F0B', nombre: 'Ámbar' },
    { hex: '#993556', nombre: 'Rosa' },
  ];

  rubros = [
    'Peluquería',
    'Barbería',
    'Estética',
    'Spa',
    'Manicura / Pedicura',
    'Centro médico',
    'Clínica',
    'Fisioterapia',
    'Psicología',
    'Gimnasio',
    'Pilates / Yoga',
    'Crossfit',
    'Otro',
  ];

  planes = [
    {
      id: 'Basic',
      nombre: 'Basic',
      precio: 'ARS 9.999',
      periodo: '/mes',
      descripcion: 'Ideal para empezar',
      destacado: false,
      features: [
        '1 profesional',
        'Hasta 50 turnos / mes',
        'Página de reservas pública',
        'Recordatorios por WhatsApp',
      ],
    },
    {
      id: 'Individual',
      nombre: 'Individual',
      precio: 'ARS 4.999',
      periodo: '/mes',
      descripcion: 'Para independientes',
      destacado: true,
      features: [
        '1 profesional',
        'Turnos ilimitados',
        'Página de reservas pública',
        'Recordatorios por WhatsApp',
        'Personalización completa',
      ],
    },
    {
      id: 'Premium',
      nombre: 'Premium',
      precio: 'ARS 15.999',
      periodo: '/mes',
      descripcion: 'Para equipos y negocios',
      destacado: false,
      features: [
        'Profesionales ilimitados',
        'Turnos ilimitados',
        'Dashboard avanzado',
        'Personalización completa',
        'Soporte prioritario',
      ],
    },
  ];

  form1: FormGroup;
  form2: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
      private route: ActivatedRoute,
  ) {
    this.form1 = this.fb.group({
      nombreNegocio: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      telefono: ['', Validators.required],
      rubro: ['', Validators.required],
      descripcion: [''],
      direccion: [''],
      instagram: [''],
      colorPrimario: ['#534AB7'],
    });

    this.form2 = this.fb.group({
      adminNombre: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Auto-generar slug desde el nombre
    this.form1.get('nombreNegocio')?.valueChanges.subscribe((nombre) => {
      if (nombre) {
        const slug = nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        this.form1.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
      this.route.queryParams.subscribe(params => {
    if (params['paso'] === 'plan' && this.auth.getToken()) {
      this.paso = 3;
    }
  });
  }

  siguientePaso() {
    if (this.form1.invalid) {
      this.form1.markAllAsTouched();
      return;
    }
    this.paso = 2;
  }

  volverPaso() {
    this.paso = 1;
    this.error = '';
  }

  seleccionarColor(hex: string) {
    this.form1.get('colorPrimario')?.setValue(hex);
  }

  registrar() {
    if (this.form2.invalid) {
      this.form2.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const payload = { ...this.form1.value, ...this.form2.value };

    this.api.registro(payload).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem(
          'auth_user',
          JSON.stringify({ nombre: res.nombre, rol: res.rol }),
        );
        this.loading = false;
        this.paso = 3; // ← único cambio: va al paso 3 en lugar del dashboard
      },
      error: (err) => {
        this.error =
          err.error?.error ?? 'Error al registrarse, intentá de nuevo';
        this.loading = false;
      },
    });
  }

  elegirPlan(planId: string) {
    this.planSeleccionado = planId;
    this.loading = true;
    this.error = '';

    this.api.checkout(planId).subscribe({
      next: (res) => {
        window.location.href = res.checkoutUrl;
      },
      error: () => {
        this.error = 'No se pudo iniciar el pago. Intentá de nuevo.';
        this.loading = false;
        this.planSeleccionado = '';
      },
    });
  }

  saltarPago() {
    this.router.navigate(['/admin/configuracion'], {
      queryParams: { onboarding: true },
    });
  }

  get slugPreview(): string {
    return `prenotare.pro/r/${this.form1.get('slug')?.value || 'mi-negocio'}`;
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}