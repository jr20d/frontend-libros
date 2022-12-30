import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutorOp } from 'src/app/models/autores/autor-op';
import { Paginado } from 'src/app/models/paginado';
import { environment } from 'src/environments/environment';

const url_base_libros: string = environment.url_base_libros_service;

@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  constructor(private http: HttpClient) { }

  listadoAutores(paginado: Paginado){
    return this.http.get(
      `${url_base_libros}/api/autores?pagina=${paginado.pagina}&cantidad=${paginado.cantidad}&busqueda=${paginado.busqueda}&orden=${paginado.orden}`);
  }

  agregarAutor(autor: AutorOp){
    return this.http.post(`${url_base_libros}/api/autores`, autor);
  }

  actualizarAutor(autorId: number, autor: AutorOp){
    return this.http.put(`${url_base_libros}/api/autores/${autorId}`, autor);
  }

  eliminarAutor(autorId: number){
    return this.http.delete(`${url_base_libros}/api/autores/${autorId}`);
  }
}
