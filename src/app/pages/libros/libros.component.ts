import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Paginado } from 'src/app/models/paginado';
import { TablaLibro } from 'src/app/models/tabla-libro';
import { LibrosService } from 'src/app/services/libros/libros.service';
import { ActualizarComponent } from './forms/actualizar/actualizar.component';
import { AgregarComponent } from './forms/agregar/agregar.component';
import { EliminarComponent } from './forms/eliminar/eliminar.component';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})

export class LibrosComponent implements OnInit {

  totalRegistros: number = 0;

  librosTable: TablaLibro[] = [];

  private paginado: Paginado = {
    pagina: 1,
    cantidad: 10,
    busqueda: '',
    orden: 'asc'
  };

  columnas: string[] = ['nombreLibro', 'fechaPublicacion', 'cantidad', 'opciones'];
  clickedRows = new Set<TablaLibro>();
  constructor(
    public dialog: MatDialog,
    private librosService: LibrosService
  ) {}

  ngOnInit(): void {
    this.cargarInicial();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AgregarComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined){
        this.realizarBusqueda();
      }
    });
  }

  private realizarBusqueda(): void{
    this.librosService.listadoLibros(this.paginado).subscribe((resp: any) =>{
      if (resp.registros !== undefined){
        this.librosTable = resp.registros.map((l: any) => (
          { libroId: l.libroId, nombreLibro: l.nombreLibro, fechaPublicacion: l.fechaPublicacion, cantidad: l.cantidad, Opciones: '' } as TablaLibro)
          );
        this.totalRegistros = resp.totalRegistros;
      }
    });
  }

  cargarInicial(): void{
    this.paginado = {
      pagina: 1,
      cantidad: 10,
      busqueda: this.paginado.busqueda === undefined ? '' : this.paginado.busqueda,
      orden: 'asc'
    };

    this.realizarBusqueda();
  }

  buscarLibros(busqueda: string): void{
    this.paginado.busqueda = busqueda;

    this.realizarBusqueda();
  }

  cambiarPagina(event: any): void {
    this.paginado.pagina = event.pageIndex + 1;
    this.paginado.cantidad = event.pageSize;

    this.realizarBusqueda();
  }

  actualizar(libroId: number): void{
    const dialogRef = this.dialog.open(ActualizarComponent, {
      data: libroId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.realizarBusqueda();
      }
    });
  }

  eliminar(libroId: number): void{
    const dialogRef = this.dialog.open(EliminarComponent, {
      data: libroId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.realizarBusqueda();
      }
    });
  }
}
