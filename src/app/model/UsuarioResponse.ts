import { PessoaResponse } from './PessoaResponse';
import { PerfilResponse } from './PerfilResponse';
import { CargoResponse } from './CargoResponse';
import { VinculoResponse } from './VinculoResponse';

export class UsuarioResponse {
  id: number;
  username: string;
  email: string;
  pessoa: PessoaResponse;
  perfis: PerfilResponse[];
  cargo: CargoResponse;
  vinculo: VinculoResponse;
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.username = '';
    this.email = '';
    this.pessoa = new PessoaResponse();
    this.perfis = [];
    this.cargo = new CargoResponse();
    this.vinculo = new VinculoResponse();
    this.ativo = true;
  }
}
