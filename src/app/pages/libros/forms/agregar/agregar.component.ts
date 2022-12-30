import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { LibrosComponent } from '../../libros.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoresService } from 'src/app/services/autores/autores.service';
import { Paginado } from 'src/app/models/paginado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibroOp } from 'src/app/models/libros/libro-op';
import { AutorId } from 'src/app/models/autores/autor-id';
import { LibrosService } from 'src/app/services/libros/libros.service';

interface Autor{
  autorId: number,
  nombreAutor: string
}

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {

  private paginado: Paginado = {
    pagina: 1, cantidad: 5, busqueda: '', orden: 'asc'
  }

  fechaActual: Date = new Date();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  autorCtrl = new FormControl('');

  @ViewChild('autorInput') autorInput: ElementRef<HTMLInputElement> | any;

  listadoAutores: Autor[] = [];
  autores: Autor[] = [];

  constructor(
    private dialogRef: MatDialogRef<LibrosComponent>,
    private autoresService: AutoresService,
    private librosService: LibrosService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
    ) {}

  formulario: FormGroup = this.fb.group({
    nombreLibro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    fechaPublicacion: ['', [Validators.required, Validators.minLength(4)]],
    cantidad: [0, [Validators.min(1)]]
  });

  ngOnInit(): void {
    this.cargarAutores('');
  }

  cargarAutores(busqueda: string){
    this.paginado.busqueda = busqueda;

    this.autoresService.listadoAutores(this.paginado).subscribe((resp: any) =>{
      if (resp.registros !== undefined){
        this.listadoAutores = resp.registros.map((a: any) => ({ autorId: a.autorId, nombreAutor: a.nombreAutor } as Autor) );
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    let autorSelected = this.listadoAutores.find(a => a.nombreAutor.toLowerCase().startsWith(value.toLowerCase()));
    let verificarAutor = this.autores.find(a => a.nombreAutor.toLowerCase().startsWith(value.toLowerCase()));

    if (autorSelected === undefined) {
      this._snackBar.open(`El autor ${value} no está registrado`, 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
    }
    else{
      if (verificarAutor !== undefined){
        this._snackBar.open(`El autor ${autorSelected.nombreAutor} no puede ser agregado mas de una vez`, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 10000,
          panelClass: ['alerta']
        });
      }
      else{
        this.autores.push(autorSelected);
        event.chipInput!.clear();

        this.autorCtrl.setValue(null);
      }
    }

  }

  remove(autor: Autor): void {
    const index = this.autores.indexOf(autor);

    if (index >= 0) {
      this.autores.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let autorSelected = this.listadoAutores.find(a => a.nombreAutor.toLowerCase() === event.option.viewValue.toLowerCase());
    let verificarAutor = this.autores.find(a => a.nombreAutor.toLowerCase() === event.option.viewValue.toLowerCase());

    if (autorSelected === undefined) {
      this._snackBar.open(`El autor ${event.option.viewValue} no está registrado`, 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
    }
    else{
      if (verificarAutor !== undefined){
        this._snackBar.open(`El autor ${autorSelected.nombreAutor} no puede ser agregado mas de una vez`, 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 10000,
          panelClass: ['alerta']
        });
      }
      else{
        this.autores.push(autorSelected);
        this.autorInput.nativeElement.value = '';
        this.autorCtrl.setValue(null);
      }
    }
  }

  guardar(): void {
    if (this.formulario.invalid){
      this._snackBar.open('Faltan campos por completar', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      return;
    }
    if (this.autores.length === 0){
      this._snackBar.open('Debe indicar el/los autor(es) de este libro', 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['alerta']
      });
      return;
    }

    var autoresIds: AutorId[] = [];

    this.autores.forEach(a => {
      autoresIds.push({ autorId: a.autorId });
    });

    var libro = {
      nombreLibro: this.formulario.get('nombreLibro')?.value,
      fechaPublicacion:  this.formulario.get('fechaPublicacion')?.value,
      cantidad: this.formulario.get('cantidad')?.value,
      autoresIds: autoresIds
    } as LibroOp;

    this.librosService.crearLibro(libro).subscribe((resp: any) => {
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
