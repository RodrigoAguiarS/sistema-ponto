export class PerfilResponse {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.nome = '';
    this.descricao = '';
    this.ativo = true;
  }
}
