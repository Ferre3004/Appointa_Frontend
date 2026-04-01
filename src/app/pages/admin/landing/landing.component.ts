import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  features = [
    {
      icon: '📅',
      titulo: 'Turnos online 24/7',
      desc: 'Tus clientes reservan en cualquier momento, desde cualquier dispositivo. Sin llamadas, sin idas y vueltas.',
    },
    {
      icon: '💬',
      titulo: 'Recordatorios automáticos',
      desc: 'Enviamos un WhatsApp 24 horas antes del turno. Menos ausencias, más puntualidad.',
    },
    {
      icon: '⚙️',
      titulo: 'Configuración en minutos',
      desc: 'Cargá tus servicios, profesionales y horarios disponibles en menos de 10 minutos.',
    },
    {
      icon: '📊',
      titulo: 'Dashboard en tiempo real',
      desc: 'Visualizá todos los turnos del día, filtrá por fecha y gestioná el estado de cada reserva.',
    },
    {
      icon: '🎨',
      titulo: 'Tu marca, tu identidad',
      desc: 'Personalizá colores, logo y foto de portada. Tus clientes ven tu negocio, no una plataforma genérica.',
    },
    {
      icon: '🔒',
      titulo: 'Multi-tenant seguro',
      desc: 'Cada negocio tiene su espacio aislado. Tus datos son solo tuyos.',
    },
  ];

  pasos = [
    {
      numero: '01',
      titulo: 'Registrá tu negocio',
      desc: 'Creá tu cuenta en 2 minutos. Solo necesitás el nombre, tu rubro y una contraseña.',
    },
    {
      numero: '02',
      titulo: 'Configurá tu agenda',
      desc: 'Agregá tus servicios, profesionales y definí los días y horarios de atención.',
    },
    {
      numero: '03',
      titulo: 'Compartí tu link',
      desc: 'Enviá tu URL personalizada a tus clientes. Empezán a reservar al instante.',
    },
  ];

  rubros = [
    'Peluquerías', 'Barberías', 'Centros estéticos',
    'Consultorios', 'Gimnasios', 'Estudios de yoga',
    'Psicólogos', 'Nutricionistas', 'Kinesiólogos',
  ];

  planes = [
    {
      nombre: 'Starter',
      precio: 'Gratis',
      periodo: 'para siempre',
      destacado: false,
      features: [
        '1 profesional',
        'Hasta 50 turnos / mes',
        'Página de reservas pública',
        'Recordatorios por WhatsApp',
      ],
      cta: 'Empezar gratis',
    },
    {
      nombre: 'Pro',
      precio: '$XX',
      periodo: '/ mes',
      destacado: true,
      features: [
        'Profesionales ilimitados',
        'Turnos ilimitados',
        'Dashboard avanzado',
        'Personalización completa',
        'Soporte prioritario',
      ],
      cta: 'Empezar prueba gratis',
    },
    {
      nombre: 'Business',
      precio: '$XX',
      periodo: '/ mes',
      destacado: false,
      features: [
        'Todo lo de Pro',
        'Múltiples sucursales',
        'Reportes y estadísticas',
        'API access',
        'Onboarding personalizado',
      ],
      cta: 'Contactar ventas',
    },
  ];
}