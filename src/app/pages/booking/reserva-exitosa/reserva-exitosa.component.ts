import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-reserva-exitosa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-exitosa.component.html',
  styleUrl: './reserva-exitosa.component.scss'
})
export class ReservaExitosaComponent {
  constructor(public state: BookingStateService, private router: Router) {}

  nuevaReserva() {
    this.router.navigate(['/r', this.state.slug, 'paso', 'servicio']);
  }
}