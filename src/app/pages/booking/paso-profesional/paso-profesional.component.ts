import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-paso-profesional',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso-profesional.component.html',
  styleUrl: './paso-profesional.component.scss'
})
export class PasoProfesionalComponent implements OnInit {
  profesionales: any[] = [];
  loading              = true;

  constructor(
    private api:    ApiService,
    public  state:  BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.state.servicio) {
      this.router.navigate(['/r', this.state.slug, 'paso', 'servicio']);
      return;
    }
    this.api.getProfesionales(this.state.slug).subscribe({
      next: data => { this.profesionales = data; this.loading = false; },
      error: ()  => this.loading = false
    });
  }

  seleccionar(p: any) {
    this.state.profesional = p;
    this.state.slot        = null;
    this.router.navigate(['/r', this.state.slug, 'paso', 'fecha']);
  }

  volver() {
    this.router.navigate(['/r', this.state.slug, 'paso', 'servicio']);
  }
}