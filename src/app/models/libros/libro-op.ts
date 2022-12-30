import { AutorId } from "../autores/autor-id";
import { LibroBase } from "./libro-base";

export interface LibroOp extends LibroBase {
  autoresIds: AutorId[]
}
