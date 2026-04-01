import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  @Input()  label      = 'Subir imagen';
  @Input()  currentUrl = '';
  @Input()  tipo: 'logo' | 'portada' = 'logo';
  @Output() uploaded   = new EventEmitter<string>();

  uploading = false;
  error     = '';

  constructor(private cloudinary: CloudinaryService) {}

  onFileSelected(event: Event) {
    const input  = event.target as HTMLInputElement;
    const file   = input.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      this.error = 'Solo se permiten imágenes'; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'La imagen no puede superar 5MB'; return;
    }

    this.uploading = true;
    this.error     = '';

    this.cloudinary.subirImagen(file).subscribe({
      next: url => {
        this.uploading = false;
        this.uploaded.emit(url);
      },
      error: () => {
        this.uploading = false;
        this.error = 'Error al subir la imagen, intentá de nuevo';
      }
    });
  }
}