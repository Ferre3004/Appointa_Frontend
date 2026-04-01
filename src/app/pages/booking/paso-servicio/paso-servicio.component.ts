import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-paso-servicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-servicio.component.html',
  styleUrl: './paso-servicio.component.scss'
})
export class PasoServicioComponent implements OnInit {
  servicios: any[] = [];
  loading          = true;

  constructor(
    private api:    ApiService,
    public  state:  BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.getServicios(this.state.slug).subscribe({
      next: data => { this.servicios = data; this.loading = false; },
      error: ()  => this.loading = false
    });
  }

  seleccionar(servicio: any) {
    this.state.servicio    = servicio;
    this.state.profesional = null;
    this.state.slot        = null;
    this.router.navigate(['/r', this.state.slug, 'paso', 'profesional']);
  }
}