import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  slug        = '';
  tenant:      any = null;
  servicio:    any = null;
  profesional: any = null;
  slot:        any = null;

  reset() {
    this.servicio    = null;
    this.profesional = null;
    this.slot        = null;
  }

  isReady(): boolean {
    return !!this.servicio && !!this.profesional && !!this.slot;
  }
}