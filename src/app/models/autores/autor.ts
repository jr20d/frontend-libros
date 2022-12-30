import { AutorOp } from "./autor-op"

export interface Autor extends AutorOp {
  autorId: number
  cantidadLibros: number
}
