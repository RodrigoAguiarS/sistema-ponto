import { DiaSemana } from './DiaSemana';
import { UsuarioResponse } from './UsuarioResponse';

export class HorarioTrabalhoResponse {
  id?: number;
  usuario: UsuarioResponse;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFim: string;
  ativo: boolean;

  constructor() {
    this.id = undefined;
    this.usuario = new UsuarioResponse();
    this.diaSemana = DiaSemana.MONDAY;
    this.horaInicio = '08:00';
    this.horaFim = '17:00';
    this.ativo = true;
  }
}
