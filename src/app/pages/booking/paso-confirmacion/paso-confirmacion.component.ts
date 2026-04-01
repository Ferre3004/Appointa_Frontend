import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-paso-confirmacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paso-confirmacion.component.html',
  styleUrl: './paso-confirmacion.component.scss'
})
export class PasoConfirmacionComponent implements OnInit {
  form:    FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:     FormBuilder,
    private api:    ApiService,
    public  state:  BookingStateService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:   ['', Validators.required],
      telefono: ['', Validators.required],
      email:    ['', Validators.email]
    });
  }

  ngOnInit() {
    if (!this.state.isReady()) {
      this.router.navigate(['/r', this.state.slug, 'paso', 'servicio']);
    }
  }

  formatFechaHora(fh: string): string {
    const d = new Date(fh);
    return d.toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long'
    }) + ' a las ' + d.toLocaleTimeString('es-AR', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  confirmar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';

    this.api.crearReserva(this.state.slug, {
      profesionalId:   this.state.profesional.id,
      servicioId:      this.state.servicio.id,
      fechaHora:       this.state.slot.fechaHora,
      clienteNombre:   this.form.value.nombre,
      clienteTelefono: this.form.value.telefono,
      clienteEmail:    this.form.value.email
    }).subscribe({
      next: () => {
        this.state.reset();
        this.router.navigate(['/r', this.state.slug, 'reserva-exitosa']);
      },
      error: () => {
        this.error   = 'Hubo un error al confirmar el turno. Intentá de nuevo.';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/r', this.state.slug, 'paso', 'fecha']);
  }
}