import { CargoResponse } from './CargoResponse';
import { VinculoResponse } from './VinculoResponse';

export class PessoaResponse {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  cargo: CargoResponse;
  vinculo: VinculoResponse;

  constructor() {
    this.id = 0;
    this.nome = '';
    this.telefone = '';
    this.cpf = '';
    this.dataNascimento = '';
    this.cargo = new CargoResponse();
    this.vinculo = new VinculoResponse();
  }
}
