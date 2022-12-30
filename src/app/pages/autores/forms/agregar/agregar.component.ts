import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AutoresComponent } from '../../autores.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoresService } from 'src/app/services/autores/autores.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AutoresComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private autoresService: AutoresService
    ) {
    }

  ngOnInit(): void {
  }

  formulario: FormGroup = this.fb.group({
    nombreAutor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]]
  });

  onNoClick(): void {
    this.dialogRef.close();
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
    this.autoresService.agregarAutor(this.formulario.value).subscribe((resp: any) => {
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
