import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-demo-overlay',
  standalone: true,
  templateUrl: './demo-overlay.component.html',
  styleUrls: ['./demo-overlay.component.scss']
})
export class DemoOverlayComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  get visible(): boolean {
    return !this.auth.estaActivo;
  }

  irAPago() {
    this.router.navigate(['/registro'], { queryParams: { paso: 'plan' } });
  }
}