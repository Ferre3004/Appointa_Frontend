import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-paso-fecha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paso-fecha.component.html',
  styleUrl: './paso-fecha.component.scss'
})
export class PasoFechaComponent implements OnInit {
  fechaSeleccionada = '';
  slots:   any[]   = [];
  loading          = false;
  minFecha         = '';

  constructor(
    private api:    ApiService,
    public  state:  BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.state.profesional) {
      this.router.navigate(['/r', this.state.slug, 'paso', 'profesional']);
      return;
    }
    // Mínimo hoy
    this.minFecha = new Date().toISOString().split('T')[0];
  }

  onFechaCambio(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.slots             = [];
    this.loading           = true;

    this.api.getSlots(
      this.state.slug,
      this.state.profesional.id,
      this.state.servicio.id,
      fecha
    ).subscribe({
      next: data => { this.slots = data; this.loading = false; },
      error: ()  => this.loading = false
    });
  }

  seleccionarSlot(slot: any) {
    this.state.slot = slot;
    this.router.navigate(['/r', this.state.slug, 'paso', 'confirmacion']);
  }

  volver() {
    this.router.navigate(['/r', this.state.slug, 'paso', 'profesional']);
  }
}