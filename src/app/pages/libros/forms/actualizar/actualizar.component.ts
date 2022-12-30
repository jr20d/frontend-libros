import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoresService } from 'src/app/services/autores/autores.service';
import { LibrosService } from 'src/app/services/libros/libros.service';
import { LibrosComponent } from '../../libros.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { LibroOp } from 'src/app/models/libros/libro-op';
import { AutorId } from 'src/app/models/autores/autor-id';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Paginado } from 'src/app/models/paginado';
import { LibroDetalle } from 'src/app/models/libros/libro-detalle';

interface Autor{
  autorId: number,
  nombreAutor: string
}

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarComponent implements OnInit {

  public registroApi: LibroDetalle = {
    libroId: 0, cantidad: 0, fechaPublicacion: new Date(), nombreLibro: '', autores: []
  };

  fechaActual: Date = new Date();

  listadoAutores: Autor[] = [];
  autores: Autor[] = [];

  private paginado: Paginado = {
    pagina: 1, cantidad: 5, busqueda: '', orden: 'asc'
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('autorInput') autorInput: ElementRef<HTMLInputElement> | any;

  constructor(
    private dialogRef: MatDialogRef<LibrosComponent>,
    private autoresService: AutoresService,
    private librosService: LibrosService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public libroId: number
  ) { }

  autorCtrl = new FormControl('');

  formulario: FormGroup = this.fb.group({
    nombreLibro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    fechaPublicacion: ['', [Validators.required, Validators.minLength(4)]],
    cantidad: [0, [Validators.min(1)]]
  });

  ngOnInit(): void {
    this.cargarAutores('');
    this.librosService.obtenerLibroPorId(this.libroId)
    .subscribe((resp: any) => {
      this.registroApi = resp as LibroDetalle;
      this.registroApi.fechaPublicacion = new Date(this.registroApi.fechaPublicacion);

      this.autores = this.registroApi.autores as Autor[];
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

    this.librosService.actualizarLibro(this.registroApi.libroId, libro).subscribe((resp: any) => {
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
