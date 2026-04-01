import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploadComponent,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  tab: 'negocio' | 'servicios' | 'profesionales' | 'horarios' = 'negocio';

  servicios: any[] = [];
  profesionales: any[] = [];
  disponibilidad: any[] = [];
  negocio: any = null;
  guardadoOk = false;
  formNegocio: FormGroup;

  dias = [
    { val: 1, nombre: 'Lunes' },
    { val: 2, nombre: 'Martes' },
    { val: 3, nombre: 'Miércoles' },
    { val: 4, nombre: 'Jueves' },
    { val: 5, nombre: 'Viernes' },
    { val: 6, nombre: 'Sábado' },
    { val: 0, nombre: 'Domingo' },
  ];

  colores = [
    { hex: '#534AB7', nombre: 'Violeta' },
    { hex: '#0F6E56', nombre: 'Verde' },
    { hex: '#185FA5', nombre: 'Azul' },
    { hex: '#993C1D', nombre: 'Coral' },
    { hex: '#854F0B', nombre: 'Ámbar' },
    { hex: '#993556', nombre: 'Rosa' },
  ];

  // Modales
  modalServicio = false;
  modalProfesional = false;
  modalHorario = false;
  esOnboarding = false;
  usuario: any;

  editandoId: number | null = null;

  formServicio: FormGroup;
  formProfesional: FormGroup;
  formHorario: FormGroup;

  saving = false;
  error = '';

  diasSeleccionados: Set<number> = new Set();

  // ── Onboarding progress ───────────────────────────────────
  get pasoServicioOk(): boolean {
    return this.servicios.some((s) => s.activo);
  }
  get pasoProfesionalOk(): boolean {
    return this.profesionales.some((p) => p.activo);
  }
  get pasoHorarioOk(): boolean {
    return this.disponibilidad.length > 0;
  }
  get onboardingCompleto(): boolean {
    return this.pasoServicioOk && this.pasoProfesionalOk && this.pasoHorarioOk;
  }

  get pasoActual(): number {
    if (!this.pasoServicioOk) return 1;
    if (!this.pasoProfesionalOk) return 2;
    if (!this.pasoHorarioOk) return 3;
    return 0; // todos completos
  }

  irAPaso(paso: number) {
    const tabs: Record<number, 'servicios' | 'profesionales' | 'horarios'> = {
      1: 'servicios',
      2: 'profesionales',
      3: 'horarios',
    };
    if (tabs[paso]) this.tab = tabs[paso];
  }
  // ─────────────────────────────────────────────────────────

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formServicio = this.fb.group({
      nombre: ['', Validators.required],
      duracionMinutos: [30, [Validators.required, Validators.min(5)]],
      precio: [null],
    });

    this.formProfesional = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      fotoUrl: [''],
    });

    this.formHorario = this.fb.group({
      profesionalId: ['', Validators.required],
      horaInicio: ['09:00', Validators.required],
      horaFin: ['18:00', Validators.required],
    });

    this.formNegocio = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      telefono: [''],
      direccion: [''],
      instagram: [''],
      logoUrl: [''],
      fotoPortada: [''],
      colorPrimario: ['#534AB7'],
    });
  }

  ngOnInit() {
    this.usuario = this.auth.getUser();
    this.esOnboarding =
      this.route.snapshot.queryParamMap.get('onboarding') === 'true';
    this.cargarTodo();
  }

  cargarTodo() {
    this.api.getConfigServicios().subscribe((d) => (this.servicios = d));
    this.api
      .getConfigProfesionales()
      .subscribe((d) => (this.profesionales = d));
    this.api.getDisponibilidad().subscribe((d) => (this.disponibilidad = d));
    this.api.getNegocio().subscribe((n) => {
      this.negocio = n;
      this.formNegocio.patchValue({
        nombre: n.nombre,
        descripcion: n.descripcion ?? '',
        telefono: n.telefono ?? '',
        direccion: n.direccion ?? '',
        instagram: n.instagram ?? '',
        logoUrl: n.logoUrl ?? '',
        fotoPortada: n.fotoPortada ?? '',
        colorPrimario: n.colorPrimario ?? '#534AB7',
      });
    });
  }

  toggleDia(val: number) {
    if (this.diasSeleccionados.has(val)) {
      this.diasSeleccionados.delete(val);
    } else {
      this.diasSeleccionados.add(val);
    }
  }

  seleccionarLaborales() {
    [1, 2, 3, 4, 5].forEach((d) => this.diasSeleccionados.add(d));
  }
  limpiarDias() {
    this.diasSeleccionados.clear();
  }

  // ── Servicios ──────────────────────────────────────────────
  abrirNuevoServicio() {
    this.editandoId = null;
    this.formServicio.reset({ nombre: '', duracionMinutos: 30, precio: null });
    this.modalServicio = true;
  }

  abrirEditarServicio(s: any) {
    this.editandoId = s.id;
    this.formServicio.setValue({
      nombre: s.nombre,
      duracionMinutos: s.duracionMinutos,
      precio: s.precio ?? null,
    });
    this.modalServicio = true;
  }

  guardarServicio() {
    if (this.formServicio.invalid) {
      this.formServicio.markAllAsTouched();
      return;
    }
    this.saving = true;
    const data = this.formServicio.value;
    const obs = this.editandoId
      ? this.api.editarServicio(this.editandoId, data)
      : this.api.crearServicio(data);

    obs.subscribe({
      next: () => {
        this.modalServicio = false;
        this.saving = false;
        this.api.getConfigServicios().subscribe((d) => (this.servicios = d));
      },
      error: () => (this.saving = false),
    });
  }

  toggleServicio(s: any) {
    this.api.eliminarServicio(s.id).subscribe(() => (s.activo = !s.activo));
  }

  // ── Profesionales ──────────────────────────────────────────
  abrirNuevoProfesional() {
    this.editandoId = null;
    this.formProfesional.reset({ nombre: '', descripcion: '', fotoUrl: '' });
    this.modalProfesional = true;
  }

  abrirEditarProfesional(p: any) {
    this.editandoId = p.id;
    this.formProfesional.setValue({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      fotoUrl: p.fotoUrl ?? '',
    });
    this.modalProfesional = true;
  }

  guardarProfesional() {
    if (this.formProfesional.invalid) {
      this.formProfesional.markAllAsTouched();
      return;
    }
    this.saving = true;
    const data = this.formProfesional.value;
    const obs = this.editandoId
      ? this.api.editarProfesional(this.editandoId, data)
      : this.api.crearProfesional(data);

    obs.subscribe({
      next: () => {
        this.modalProfesional = false;
        this.saving = false;
        this.api
          .getConfigProfesionales()
          .subscribe((d) => (this.profesionales = d));
      },
      error: () => (this.saving = false),
    });
  }

  toggleProfesional(p: any) {
    this.api.eliminarProfesional(p.id).subscribe(() => (p.activo = !p.activo));
  }

  // ── Horarios ───────────────────────────────────────────────
  abrirNuevoHorario() {
    this.formHorario.reset({
      profesionalId: '',
      horaInicio: '09:00',
      horaFin: '18:00',
    });
    this.diasSeleccionados.clear();
    this.modalHorario = true;
  }

  guardarHorario() {
    this.error = '';
    if (this.formHorario.get('profesionalId')?.invalid) {
      this.error = 'Seleccioná un profesional';
      return;
    }
    if (this.diasSeleccionados.size === 0) {
      this.error = 'Seleccioná al menos un día';
      return;
    }

    const { profesionalId, horaInicio, horaFin } = this.formHorario.value;

    const duplicados = Array.from(this.diasSeleccionados).filter((dia) =>
      this.disponibilidad.some(
        (d) => d.profesionalId == profesionalId && d.diaSemana === dia,
      ),
    );

    if (duplicados.length > 0) {
      const diasDup = duplicados
        .map((d) => this.dias.find((x) => x.val === d)?.nombre)
        .join(', ');
      this.error = `Ya existe horario para: ${diasDup}. Eliminalo primero.`;
      return;
    }

    this.saving = true;
    const requests = Array.from(this.diasSeleccionados).map((dia) =>
      this.api.crearDisponibilidad({
        profesionalId,
        diaSemana: dia,
        horaInicio,
        horaFin,
      }),
    );

    Promise.all(requests.map((r) => r.toPromise()))
      .then(() => {
        this.modalHorario = false;
        this.saving = false;
        this.error = '';
        this.diasSeleccionados.clear();
        this.api
          .getDisponibilidad()
          .subscribe((d) => (this.disponibilidad = d));
      })
      .catch(() => {
        this.saving = false;
        this.error = 'Error al guardar algunos horarios';
      });
  }

  getHorariosPorProfesional(profesionalId: number): any[] {
    const orden = [1, 2, 3, 4, 5, 6, 0];
    return this.disponibilidad
      .filter((d) => d.profesionalId === profesionalId)
      .sort((a, b) => orden.indexOf(a.diaSemana) - orden.indexOf(b.diaSemana));
  }

  diaYaOcupado(dia: number): boolean {
    const profesionalId = this.formHorario.get('profesionalId')?.value;
    if (!profesionalId) return false;
    return this.disponibilidad.some(
      (d) => d.profesionalId == profesionalId && d.diaSemana === dia,
    );
  }

  eliminarHorario(id: number) {
    this.api
      .eliminarDisponibilidad(id)
      .subscribe(
        () =>
          (this.disponibilidad = this.disponibilidad.filter(
            (d) => d.id !== id,
          )),
      );
  }

  getProfesionalNombre(id: number): string {
    return this.profesionales.find((p) => p.id === id)?.nombre ?? '';
  }

  logout() {
    this.auth.logout();
  }
  irDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  // ── Mi negocio ─────────────────────────────────────────────
  guardarNegocio() {
    if (this.formNegocio.invalid) return;
    this.saving = true;
    this.guardadoOk = false;
    this.error = '';

    this.api.editarNegocio(this.formNegocio.value).subscribe({
      next: () => {
        this.saving = false;
        this.guardadoOk = true;
        this.api.getNegocio().subscribe((n) => (this.negocio = n));
        setTimeout(() => (this.guardadoOk = false), 3000);
      },
      error: () => (this.saving = false),
    });
  }

  copiarLink() {
    const link = `${window.location.origin}/r/${this.negocio?.slug}`;
    navigator.clipboard.writeText(link);
    this.guardadoOk = true;
    setTimeout(() => (this.guardadoOk = false), 2000);
  }
}
