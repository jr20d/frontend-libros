import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibroDetalle } from 'src/app/models/libros/libro-detalle';
import { LibrosService } from 'src/app/services/libros/libros.service';
import { LibrosComponent } from '../../libros.component';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  public registroApi: LibroDetalle = {
    libroId: 0, cantidad: 0, fechaPublicacion: new Date(), nombreLibro: '', autores: []
  };

  constructor(
    private dialogRef: MatDialogRef<LibrosComponent>,
    private librosService: LibrosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public libroId: number
  ) { }

  ngOnInit(): void {
    this.librosService.obtenerLibroPorId(this.libroId)
    .subscribe((resp: any) => {
      this.registroApi = resp as LibroDetalle;
      this.registroApi.fechaPublicacion = new Date(this.registroApi.fechaPublicacion);
    }, err => {
      this._snackBar.open(err.error.mensaje || 'Ha ocurrido un error inesperado', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      this.dialogRef.close({
        close: true
      });
    });
  }

  guardar(): void{
    this.librosService.eliminarLibro(this.registroApi.libroId).subscribe((resp: any) => {
      this._snackBar.open(resp.mensaje, 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      this.dialogRef.close();
    }, (err: any) => {
      this._snackBar.open(err.error.mensaje || 'Ocurrió un error inesperado', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
    });
  }
}
