import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Paginado } from 'src/app/models/paginado';
import { TablaAutor } from 'src/app/models/tablaAutor';
import { AutoresService } from 'src/app/services/autores/autores.service';
import { ActualizarComponent } from './forms/actualizar/actualizar.component';
import { AgregarComponent } from './forms/agregar/agregar.component';
import { EliminarComponent } from './forms/eliminar/eliminar.component';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css']
})
export class AutoresComponent implements OnInit {

  columnas: string[] = ['nombreAutor', 'cantidadLibros', 'opciones'];

  @ViewChild("AgregarComponent") agregarForm!: AgregarComponent;

  private paginado: Paginado = {
    pagina: 1,
    cantidad: 10,
    busqueda: '',
    orden: 'asc'
  };

  totalRegistros: number = 0;

  autoresTable: TablaAutor[] = [];

  clickedRows = new Set<TablaAutor>();
  constructor(
    public dialog: MatDialog,
    private autoresService: AutoresService,
    matPaginator: MatPaginatorIntl
    ) {
      matPaginator.itemsPerPageLabel = "Registros por página";
      matPaginator.changes.next();
    }

  ngOnInit(): void {
    this.cargaInicial();
  }

  cargaInicial(): void{
    this.paginado = {
      pagina: 1,
      cantidad: 10,
      busqueda: this.paginado.busqueda === undefined ? '' : this.paginado.busqueda,
      orden: 'asc'
    };
    this.realizarBusqueda();
  }

  private realizarBusqueda(): void{
    this.autoresService.listadoAutores(this.paginado).subscribe((resp: any) =>{
      if (resp.registros !== undefined){
        this.autoresTable = resp.registros.map((a: any) => (
          { autorId: a.autorId, nombreAutor: a.nombreAutor, cantidadLibros: a.cantidadLibros, Opciones: '' } as TablaAutor)
          );
        this.totalRegistros = resp.totalRegistros;
      }
    });
  }

  buscarAutores(busqueda: string): void{
    this.paginado.busqueda = busqueda;

    this.realizarBusqueda();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AgregarComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.cargaInicial();
      }
    });
  }

  cambiarPagina(event: any): void {
    this.paginado.pagina = event.pageIndex + 1;
    this.paginado.cantidad = event.pageSize;

    this.realizarBusqueda();
  }

  formActualizar(registro: TablaAutor): void{
    const dialogRef = this.dialog.open(ActualizarComponent, {
      data: registro
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.cargaInicial();
      }
    });
  }

  eliminarAutor(registro: TablaAutor): void{
    const dialogRef = this.dialog.open(EliminarComponent, {
      data: registro
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.cargaInicial();
      }
    });
  }
}
