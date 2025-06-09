import { TipoRegistro } from './TipoRegistro';
import { UsuarioResponse } from './UsuarioResponse';

export class RegistroPontoResponse {
  id: number;
  usuario: UsuarioResponse;
  tipo: TipoRegistro;
  dataHora: string; // Formato ISO para data e hora
  observacao: string;
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.usuario = new UsuarioResponse();
    this.tipo = TipoRegistro.ENTRADA;
    this.dataHora = new Date().toISOString();
    this.observacao = '';
    this.ativo = true;
  }
}
