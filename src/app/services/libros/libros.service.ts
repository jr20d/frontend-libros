import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LibroBase } from 'src/app/models/libros/libro-base';
import { Paginado } from 'src/app/models/paginado';
import { environment } from 'src/environments/environment';

const url_base_libros: string = environment.url_base_libros_service;

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  constructor(private http: HttpClient) { }

  listadoLibros(paginado: Paginado){
    return this.http.get(
      `${url_base_libros}/api/libros?pagina=${paginado.pagina}&cantidad=${paginado.cantidad}&busqueda=${paginado.busqueda}&orden=${paginado.orden}`);
  }

  obtenerLibroPorId(libroId: number){
    return this.http.get(`${url_base_libros}/api/libros/${libroId}`);
  }

  crearLibro(libro: LibroBase){
    return this.http.post(`${url_base_libros}/api/libros`, libro);
  }

  actualizarLibro(libroId: number, libro: LibroBase){
    return this.http.put(`${url_base_libros}/api/libros/${libroId}`, libro);
  }

  eliminarLibro(libroId: number){
    return this.http.delete(`${url_base_libros}/api/libros/${libroId}`);
  }
}
