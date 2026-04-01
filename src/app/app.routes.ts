import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./pages/admin/landing/landing.component').then(m => m.LandingComponent),
  },
  // Booking pública
  {
    path: 'r/:slug',
    loadComponent: () =>
      import('./pages/booking/booking-shell/booking-shell.component').then(
        (m) => m.BookingShellComponent,
      ),
    children: [
      { path: '', redirectTo: 'paso/servicio', pathMatch: 'full' },
      {
        path: 'paso/servicio',
        loadComponent: () =>
          import('./pages/booking/paso-servicio/paso-servicio.component').then(
            (m) => m.PasoServicioComponent,
          ),
      },
      {
        path: 'paso/profesional',
        loadComponent: () =>
          import('./pages/booking/paso-profesional/paso-profesional.component').then(
            (m) => m.PasoProfesionalComponent,
          ),
      },
      {
        path: 'paso/fecha',
        loadComponent: () =>
          import('./pages/booking/paso-fecha/paso-fecha.component').then(
            (m) => m.PasoFechaComponent,
          ),
      },
      {
        path: 'paso/confirmacion',
        loadComponent: () =>
          import('./pages/booking/paso-confirmacion/paso-confirmacion.component').then(
            (m) => m.PasoConfirmacionComponent,
          ),
      },
      {
        path: 'reserva-exitosa',
        loadComponent: () =>
          import('./pages/booking/reserva-exitosa/reserva-exitosa.component').then(
            (m) => m.ReservaExitosaComponent,
          ),
      },
    ],
  },

  // Admin
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (m) => m.RegistroComponent,
      ),
  },
  {
    path: 'admin/configuracion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/configuracion/configuracion.component').then(
        (m) => m.ConfiguracionComponent,
      ),
  },

  { path: '', redirectTo: '/admin/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/login' },
];
