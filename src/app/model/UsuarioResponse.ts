import { PessoaResponse } from './PessoaResponse';
import { PerfilResponse } from './PerfilResponse';

export class UsuarioResponse {
  id: number;
  username: string;
  email: string;
  pessoa: PessoaResponse;
  perfis: PerfilResponse[];
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.username = '';
    this.email = '';
    this.pessoa = new PessoaResponse();
    this.perfis = [];
    this.ativo = true;
  }
}
