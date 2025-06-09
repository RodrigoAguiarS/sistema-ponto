import { RegistroPontoResponse } from "./RegistroPontoResponse";

export class JornadaResponse {
  id: number;
  data: string;
  usuarioId: number;
  horasTrabalhadas: string;
  horasExtras: string;
  horasRestantes: string;
  registrosPonto: RegistroPontoResponse[];

  constructor() {
    this.id = 0;
    this.data = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    this.usuarioId = 0;
    this.horasTrabalhadas = 'PT0H';
    this.horasExtras = 'PT0H';
    this.horasRestantes = 'PT0H';
    this.registrosPonto = [];
  }
}
