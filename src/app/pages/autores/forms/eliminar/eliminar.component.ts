import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablaAutor } from 'src/app/models/tablaAutor';
import { AutoresService } from 'src/app/services/autores/autores.service';
import { AutoresComponent } from '../../autores.component';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AutoresComponent>,
    private _snackBar: MatSnackBar,
    private autoresService: AutoresService,
    @Inject(MAT_DIALOG_DATA) public dataAutor: TablaAutor
    ) {
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(): void{
    this.autoresService.eliminarAutor(this.dataAutor.autorId).subscribe((resp: any) => {
      this._snackBar.open(resp.mensaje, 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      this.dialogRef.close();
    }, (err: any) => {
      this._snackBar.open(err.error.mensaje, 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
    });
  }
}
