import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, password });
  }

  // Booking pública
  getTenant(slug: string): Observable<any> {
    return this.http.get(`${this.base}/booking/${slug}`);
  }

  getServicios(slug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/booking/${slug}/servicios`);
  }

  getProfesionales(slug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/booking/${slug}/profesionales`);
  }

  getSlots(
    slug: string,
    profesionalId: number,
    servicioId: number,
    fecha: string,
  ): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/booking/${slug}/slots`, {
      params: { profesionalId, servicioId, fecha },
    });
  }

  crearReserva(slug: string, data: any): Observable<any> {
    return this.http.post(`${this.base}/booking/${slug}/reservar`, data);
  }

  // Admin
  getReservas(fecha?: string): Observable<any[]> {
    const params: any = {};
    if (fecha) params['fecha'] = fecha;
    return this.http.get<any[]>(`${this.base}/admin/reservas`, { params });
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.base}/admin/reservas/${id}/estado`, {
      estado,
    });
  }

  registro(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/registro`, data);
  }
  // Config — Servicios
  getConfigServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/config/servicios`);
  }
  crearServicio(data: any): Observable<any> {
    return this.http.post(`${this.base}/admin/config/servicios`, data);
  }
  editarServicio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/admin/config/servicios/${id}`, data);
  }
  eliminarServicio(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/config/servicios/${id}`);
  }

  // Config — Profesionales
  getConfigProfesionales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/config/profesionales`);
  }
  crearProfesional(data: any): Observable<any> {
    return this.http.post(`${this.base}/admin/config/profesionales`, data);
  }
  editarProfesional(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/admin/config/profesionales/${id}`, data);
  }
  eliminarProfesional(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/config/profesionales/${id}`);
  }

  // Config — Disponibilidad
  getDisponibilidad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/config/disponibilidad`);
  }
  crearDisponibilidad(data: any): Observable<any> {
    return this.http.post(`${this.base}/admin/config/disponibilidad`, data);
  }
  eliminarDisponibilidad(id: number): Observable<any> {
    return this.http.delete(`${this.base}/admin/config/disponibilidad/${id}`);
  }
  getNegocio(): Observable<any> {
  return this.http.get(`${this.base}/admin/config/negocio`);
}

editarNegocio(data: any): Observable<any> {
  return this.http.put(`${this.base}/admin/config/negocio`, data);
}

// LemonSqueezy
checkout(plan: string): Observable<{ checkoutUrl: string }> {
  return this.http.post<{ checkoutUrl: string }>(
    `${this.base}/auth/checkout`,
    { plan }
  );
}
}
