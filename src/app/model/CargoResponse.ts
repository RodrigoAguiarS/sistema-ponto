export class CargoResponse {
  id: number;
  nome: string;
  descricao: string;
  salarioBase: number;
  nivelHierarquia: number;
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.nome = '';
    this.descricao = '';
    this.salarioBase = 0;
    this.nivelHierarquia = 0;
    this.ativo = true;
  }
}
