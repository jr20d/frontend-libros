export interface Paginado {
  pagina: number,
  cantidad: number,
  busqueda: string,
  orden: 'asc' | 'desc'
}
