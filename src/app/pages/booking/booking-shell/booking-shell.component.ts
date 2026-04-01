import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-booking-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './booking-shell.component.html',
  styleUrl: './booking-shell.component.scss'
})
export class BookingShellComponent implements OnInit {
  loading = true;
  error   = false;

  pasos = [
    { label: 'Servicio',     path: 'paso/servicio'     },
    { label: 'Profesional',  path: 'paso/profesional'  },
    { label: 'Fecha y hora', path: 'paso/fecha'        },
    { label: 'Confirmación', path: 'paso/confirmacion' },
  ];

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private api:    ApiService,
    public  state:  BookingStateService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.state.slug = slug;

    this.api.getTenant(slug).subscribe({
      next: tenant => {
        this.state.tenant = tenant;
        this.loading      = false;
        if (tenant.colorPrimario) {
          document.documentElement.style.setProperty('--color-brand', tenant.colorPrimario);
        }
      },
      error: () => {
        this.error   = true;
        this.loading = false;
      }
    });
  }

  getPasoActivo(): number {
    const url = this.router.url;
    if (url.includes('profesional'))  return 1;
    if (url.includes('fecha'))        return 2;
    if (url.includes('confirmacion')) return 3;
    return 0;
  }
}