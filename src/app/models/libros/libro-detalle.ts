import { AutorDetalle } from "../autores/autor-detalle";
import { Libro } from "./libro";

export interface LibroDetalle extends Libro {
  autores: AutorDetalle[]
}
