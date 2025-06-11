import { RegistroPontoResponse } from "./RegistroPontoResponse";

export class JornadaResponse {
  id: number;
  data: string;
  usuarioId: number;
  horasTrabalhadas: string; // Duration ISO 8601 (PT2H30M = 2 horas e 30 minutos)
  horasExtras: string;      // Duration ISO 8601
  horasRestantes: string;   // Duration ISO 8601
  registrosPonto: RegistroPontoResponse[];

  constructor() {
    this.id = 0;
    this.data = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    this.usuarioId = 0;
    this.horasTrabalhadas = 'PT0H'; // inicialização correta
    this.horasExtras = 'PT0H';
    this.horasRestantes = 'PT0H';
    this.registrosPonto = [];
  }

  // Método auxiliar para converter duração ISO 8601 em minutos
  converterDuracaoParaMinutos(duracao: string): number {
    // Formatos possíveis: PT2H30M, PT30M, PT2H, etc.
    let minutos = 0;

    // Extrair horas
    const horasMatch = duracao.match(/(\d+)H/);
    if (horasMatch && horasMatch[1]) {
      minutos += parseInt(horasMatch[1]) * 60;
    }

    // Extrair minutos
    const minutosMatch = duracao.match(/(\d+)M/);
    if (minutosMatch && minutosMatch[1]) {
      minutos += parseInt(minutosMatch[1]);
    }

    return minutos;
  }

  // Método para formatação amigável da duração
  formatarDuracao(duracao: string): string {
    const minutos = this.converterDuracaoParaMinutos(duracao);
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    if (horas === 0) {
      return `${minutosRestantes}min`;
    } else if (minutosRestantes === 0) {
      return `${horas}h`;
    } else {
      return `${horas}h ${minutosRestantes}min`;
    }
  }
}
