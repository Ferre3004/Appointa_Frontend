import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent implements OnInit {
  paso = 1;
  totalPasos = 3;
  saving = false;
  error  = '';
  usuario: any;

  // Paso 1 — Servicios
  servicios:      any[] = [];
  formServicio:   FormGroup;
  mostrarFormServicio = false;

  // Paso 2 — Profesionales
  profesionales:     any[] = [];
  formProfesional:   FormGroup;
  mostrarFormProfesional = false;

  // Paso 3 — Horarios
  disponibilidad:    any[] = [];
  formHorario:       FormGroup;
  diasSeleccionados: Set<number> = new Set();
  mostrarFormHorario = false;

  dias = [
    { val: 1, nombre: 'Lunes'     },
    { val: 2, nombre: 'Martes'    },
    { val: 3, nombre: 'Miércoles' },
    { val: 4, nombre: 'Jueves'    },
    { val: 5, nombre: 'Viernes'   },
    { val: 6, nombre: 'Sábado'    },
    { val: 0, nombre: 'Domingo'   },
  ];

  constructor(
    private fb:     FormBuilder,
    private api:    ApiService,
    private auth:   AuthService,
    private router: Router
  ) {
    this.formServicio = this.fb.group({
      nombre:          ['', Validators.required],
      duracionMinutos: [30, [Validators.required, Validators.min(5)]],
      precio:          [null]
    });

    this.formProfesional = this.fb.group({
      nombre:      ['', Validators.required],
      descripcion: ['']
    });

    this.formHorario = this.fb.group({
      profesionalId: ['', Validators.required],
      horaInicio:    ['09:00', Validators.required],
      horaFin:       ['18:00', Validators.required]
    });
  }

  ngOnInit() {
    this.usuario = this.auth.getUser();
  }

  // ── Paso 1: Servicios ──────────────────────────────────────
  agregarServicio() {
    if (this.formServicio.invalid) { this.formServicio.markAllAsTouched(); return; }
    this.saving = true;
    this.api.crearServicio(this.formServicio.value).subscribe({
      next: s => {
        this.servicios.push(s);
        this.formServicio.reset({ nombre: '', duracionMinutos: 30, precio: null });
        this.mostrarFormServicio = false;
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  eliminarServicio(index: number) {
    const s = this.servicios[index];
    this.api.eliminarServicio(s.id).subscribe(() =>
      this.servicios.splice(index, 1));
  }

  // ── Paso 2: Profesionales ──────────────────────────────────
  agregarProfesional() {
    if (this.formProfesional.invalid) { this.formProfesional.markAllAsTouched(); return; }
    this.saving = true;
    this.api.crearProfesional(this.formProfesional.value).subscribe({
      next: p => {
        this.profesionales.push(p);
        this.formProfesional.reset({ nombre: '', descripcion: '' });
        this.mostrarFormProfesional = false;
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  eliminarProfesional(index: number) {
    const p = this.profesionales[index];
    this.api.eliminarProfesional(p.id).subscribe(() =>
      this.profesionales.splice(index, 1));
  }

  // ── Paso 3: Horarios ───────────────────────────────────────
  toggleDia(val: number) {
    this.diasSeleccionados.has(val)
      ? this.diasSeleccionados.delete(val)
      : this.diasSeleccionados.add(val);
  }

  seleccionarLaborales() { [1,2,3,4,5].forEach(d => this.diasSeleccionados.add(d)); }
  limpiarDias()          { this.diasSeleccionados.clear(); }

  agregarHorario() {
    if (this.formHorario.invalid) { this.formHorario.markAllAsTouched(); return; }
    if (this.diasSeleccionados.size === 0) { this.error = 'Seleccioná al menos un día'; return; }
    this.saving = true;
    this.error  = '';

    const { profesionalId, horaInicio, horaFin } = this.formHorario.value;
    const requests = Array.from(this.diasSeleccionados).map(dia =>
      this.api.crearDisponibilidad({ profesionalId, diaSemana: dia, horaInicio, horaFin })
    );

    Promise.all(requests.map(r => r.toPromise())).then(() => {
      this.api.getDisponibilidad().subscribe(d => {
        this.disponibilidad = d;
        this.formHorario.reset({ profesionalId: '', horaInicio: '09:00', horaFin: '18:00' });
        this.diasSeleccionados.clear();
        this.mostrarFormHorario = false;
        this.saving = false;
      });
    }).catch(() => {
      this.saving = false;
      this.error  = 'Error al guardar algunos horarios';
    });
  }

  eliminarHorario(id: number) {
    this.api.eliminarDisponibilidad(id).subscribe(() =>
      this.disponibilidad = this.disponibilidad.filter(d => d.id !== id));
  }

  getHorariosPorProfesional(profesionalId: number): any[] {
    const orden = [1,2,3,4,5,6,0];
    return this.disponibilidad
      .filter(d => d.profesionalId === profesionalId)
      .sort((a, b) => orden.indexOf(a.diaSemana) - orden.indexOf(b.diaSemana));
  }

  // ── Navegación ─────────────────────────────────────────────
  siguiente() {
    this.error = '';
    if (this.paso === 1 && this.servicios.length === 0) {
      this.error = 'Agregá al menos un servicio para continuar'; return;
    }
    if (this.paso === 2 && this.profesionales.length === 0) {
      this.error = 'Agregá al menos un profesional para continuar'; return;
    }
    this.paso++;
  }

  finalizar() {
    this.router.navigate(['/admin/dashboard']);
  }

  omitir() {
    this.router.navigate(['/admin/dashboard']);
  }
}