import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablaAutor } from 'src/app/models/tablaAutor';
import { AutoresService } from 'src/app/services/autores/autores.service';
import { AutoresComponent } from '../../autores.component';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AutoresComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private autoresService: AutoresService,
    @Inject(MAT_DIALOG_DATA) public dataAutor: TablaAutor
  ) { }

  formulario: FormGroup = this.fb.group({
    nombreAutor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]]
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formulario.setValue({ nombreAutor: this.dataAutor.nombreAutor });
  }

  guardar(): void{
    if (this.formulario.invalid){
      this._snackBar.open('El nombre del autor debe contener entre 3 a 150 caracteres', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      return;
    }
    this.autoresService.actualizarAutor(this.dataAutor.autorId, this.formulario.value).subscribe((resp: any) => {
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
