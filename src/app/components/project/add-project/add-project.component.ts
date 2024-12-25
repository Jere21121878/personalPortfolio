import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { ProjectService } from '../../../services/project.service'; // Asegúrate de importar el servicio de proyectos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
  
@Component({
  standalone: true,
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
  imports: [ SharedModule ],
})
export class AddProjectComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  operacion: string = 'Agregar';

  thumbnailFile: File | null = null;
  photos: File[] = [];

  constructor(
    private fb: FormBuilder,
    private _projectService: ProjectService, // Servicio de proyectos
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddProjectComponent>, // Inyectar el servicio de referencia del diálogo
    @Inject(MAT_DIALOG_DATA) public data: { userId: string } // Inyectar datos recibidos
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      role: ['', Validators.required],
      features: ['', Validators.required],
      technologies: ['', Validators.required],
      category: ['', Validators.required],
      thumbnailFile: [null],
      photos: [null]
    });
  }

  ngOnInit(): void {}

  // Método para cerrar el modal al hacer clic en el botón "Cancelar"
  closeDialog(): void {
    this.dialogRef.close(false); // Se pasa un valor que indica que el modal se cerró sin guardar
  }

  addProject() {
    if (this.form.valid) {
      const formData = this.form.value;
      const { name, description, role, features, technologies, category } = formData;
      
      // Llamar al servicio para agregar el proyecto
      this._projectService.addProject({ 
        name, description, role, features, technologies, category 
      }, this.thumbnailFile, this.photos).subscribe(
        (newProject) => {
          this.mensajeExito('registrado');
          this.dialogRef.close(true); // Cerrar el modal y devolver un resultado positivo
        },
        (error) => {
          this.mensajeError('Error al registrar el proyecto');
        }
      );
    }
  }

  // Mostrar mensaje de éxito
  mensajeExito(texto: string) {
    this._snackBar.open(`El proyecto fue ${texto} con éxito`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  // Mostrar mensaje de error
  mensajeError(texto: string) {
    this._snackBar.open(texto, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: ['error-snackbar']
    });
  }

  // Manejar archivo de Thumbnail
  onThumbnailFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.thumbnailFile = file;
    }
  }

  // Manejar archivo(s) de fotos
  onPhotosFileChange(event: any) {
    this.photos = Array.from(event.target.files);
  }
}
