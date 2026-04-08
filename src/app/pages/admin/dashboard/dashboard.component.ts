import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { DemoOverlayComponent } from '../demo-overlay/demo-overlay.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [CommonModule, FormsModule, RouterModule, DemoOverlayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  reservas: any[]        = [];
  reservasFiltradas: any[] = [];
  loading                = false;
  fechaSeleccionada      = new Date().toISOString().split('T')[0]; // hoy
  usuario: any;

  estados = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];

  constructor(
    private api:    ApiService,
    private auth:   AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.auth.getUser();
    this.cargarReservas();
  }

  cargarReservas() {
    this.loading = true;
    this.api.getReservas(this.fechaSeleccionada).subscribe({
      next: data => {
        this.reservas         = data;
        this.reservasFiltradas = data;
        this.loading          = false;
      },
      error: () => this.loading = false
    });
  }

  cambiarFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.cargarReservas();
  }

  irHoy() {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
    this.cargarReservas();
  }

  cambiarEstado(reserva: any, estado: string) {
    this.api.cambiarEstado(reserva.id, estado).subscribe({
      next: () => reserva.estado = estado
    });
  }

  getBadgeClass(estado: string): string {
    const map: any = {
      'Pendiente':  'badge-pendiente',
      'Confirmada': 'badge-confirmada',
      'Completada': 'badge-completada',
      'Cancelada':  'badge-cancelada'
    };
    return map[estado] ?? 'badge-pendiente';
  }

  formatHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-AR', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatFecha(fechaHora: string): string {
    return new Date(fechaHora).toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  get totalPendientes(): number {
    return this.reservas.filter(r => r.estado === 'Pendiente').length;
  }

  get totalConfirmadas(): number {
    return this.reservas.filter(r => r.estado === 'Confirmada').length;
  }

  logout() {
    this.auth.logout();
  }
}