import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-overlay.component.html',
  styleUrls: ['./demo-overlay.component.scss'],
})
export class DemoOverlayComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  oculto = false;

  explorar() {
    this.oculto = true;
  }

  get visible(): boolean {
    return !this.auth.estaActivo && !this.oculto;
  }

  irAPago() {
    this.router.navigate(['/registro'], { queryParams: { paso: 'plan' } });
  }
}
